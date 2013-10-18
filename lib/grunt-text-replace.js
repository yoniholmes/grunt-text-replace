var grunt = require('grunt');
var path = require('path');
var gruntTextReplace = {};


exports.replace = function (settings) {
  gruntTextReplace.replace(settings);
}

exports.replaceText = function (settings) {
  var text = settings.text;
  var replacements = settings.replacements;
  return gruntTextReplace.replaceTextMultiple(text, replacements);
}

exports.replaceFile = function (settings) {
  return gruntTextReplace.replaceFile(settings)
}

exports.replaceFileMultiple = function (settings) {
  return gruntTextReplace.replaceFileMultiple(settings)
}



gruntTextReplace = {
  replaceFileMultiple: function (settings) {
    settings.files.forEach(function (file_data) {
      file_data.src.forEach(function (src) {
        gruntTextReplace.replaceFile({
          src: src,
          dest: file_data.dest,
          replacements: settings.replacements
        });
      });
    });
  },

  replaceFile: function (settings) {
    var pathToSourceFile = settings.src;
    var pathToDestinationFile = this.getPathToDestination(pathToSourceFile, settings.dest);
    var replacements = settings.replacements;
    grunt.file.copy(pathToSourceFile, pathToDestinationFile, {
      process: function (text) {
        return gruntTextReplace.replaceTextMultiple(text, replacements);
      }
    });
  },

  replaceTextMultiple: function (text, replacements) {
    return replacements.reduce(function (newText, replacement) {
      return gruntTextReplace.replaceText({
        text: newText, 
        from: replacement.from, 
        to: replacement.to
      });
    }, text);
  },

  replaceText: function (settings) {
    var text = settings.text;
    var from = this.convertPatternToRegex(settings.from);
    var to = this.expandReplacement(settings.to);
    return text.replace(from, to);
  },

  replace: function (settings) {
    var files = settings.files
    var overwrite = settings.overwrite;
    var replacements = settings.replacements;

    if (files.length === 0 &&
        typeof replacements === 'undefined') {
      grunt.warn(gruntTextReplace.errorMessages.noTargetsDefined);
      return;
    }
    if (typeof replacements === 'undefined') {
      grunt.warn(gruntTextReplace.errorMessages.noReplacements);
      return;
    }
    valid = files.every(function(file_data){
      if (typeof file_data.dest === 'undefined' && overwrite !== true) {
        grunt.warn(gruntTextReplace.errorMessages.noDestination);
        return false;
      }
      if (typeof file_data.dest !== 'undefined' && overwrite === true) {
        grunt.warn(gruntTextReplace.errorMessages.overwriteFailure);
        return false;
      }
      var isDestinationDirectory = (/\/$/).test(file_data.dest);
      if ((isDestinationDirectory === false && file_data.src.length > 1) && overwrite !== true) {
        grunt.warn(gruntTextReplace.errorMessages.multipleSourceSingleDestination);
        return false;
      }
      return true;
    });
    if (valid) {
      gruntTextReplace.replaceFileMultiple({
        files: files,
        replacements: replacements
      });
    }
  },

  errorMessages: {
    noTargetsDefined: "No targets were found. Remember to wrap functionality " + 
      "within a target.",
    noSourceFiles: "No source files found",
    noDestination: "Destination is not defined! If you want to overwrite " +
      "files, then make sure to set overwrite: true. If you don't wish to " +
      "overwrite, then make sure to set a destination",
    noReplacements: "No replacements were found.",
    overwriteFailure: "Overwrite is to true, but a destination has also " +
      "been defined. If you want to overwrite files, remove the destination. " +
      "If you want to send files to a destination, then ensure overwrite is " +
      "not set to true",
    multipleSourceSingleDestination: "Cannot write multiple files to same " +
      "file. If you wish to export to a directory, make sure there is a " + 
      "trailing slash on the destination. If you wish to write to a single " +
      "file, make sure there is only one source file"
  },

  getPathToDestination: function (pathToSource, pathToDestinationFile) {
    var isDestinationDirectory = (/\/$/).test(pathToDestinationFile);
    var fileName = path.basename(pathToSource);
    var newPathToDestination;
    if (typeof pathToDestinationFile === 'undefined') {
      newPathToDestination = pathToSource;
    } else {
      newPathToDestination = pathToDestinationFile + (isDestinationDirectory ? fileName : '');
    }
    return newPathToDestination;
  },

  convertPatternToRegex: function (pattern) {
    var regexCharacters = '\\[](){}^$-.*+?|,/';
    if (typeof pattern === 'string') {
      regexCharacters.split('').forEach(function (character) {
        var characterAsRegex = new RegExp('(\\' + character + ')', 'g');
        pattern = pattern.replace(characterAsRegex, '\\$1');
      });
      pattern = new RegExp(pattern, 'g');
    } 
    return pattern;
  },

  expandReplacement: function (replacement) {
    if (typeof replacement === 'function') {
      return this.expandFunctionReplacement(replacement);
    } else if (typeof replacement === 'string') {
      return this.expandStringReplacement(replacement);
    }
  },

  expandFunctionReplacement: function (replacement) {
    return function () {
      var matchedSubstring = arguments[0];
      var index = arguments[arguments.length - 2];
      var fullText = arguments[arguments.length - 1];
      var regexMatches = Array.prototype.slice.call(arguments, 1,
        arguments.length - 2);
      var returnValue = replacement(matchedSubstring, index, fullText, 
        regexMatches);
      return (typeof returnValue === 'string') ? 
        gruntTextReplace.processGruntTemplate(returnValue) : returnValue;
    };
  },

  expandStringReplacement: function (replacement) {
    return gruntTextReplace.processGruntTemplate(replacement);
  },

  processGruntTemplate: function (string) {
    var isProcessTemplateTrue = true;
    if (grunt.task.current.data &&
        grunt.task.current.data.options && 
        typeof grunt.task.current.data.options.processTemplates !== 'undefined' && 
        grunt.task.current.data.options.processTemplates === false) {
      isProcessTemplateTrue = false;
    }
    return isProcessTemplateTrue ? grunt.template.process(string) : string;
  }

}
