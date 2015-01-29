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
    var sourceFiles = grunt.file.expand(settings.src);
    console.log("Start: " + this.getDateTime());
    console.log("FileCount: " + (sourceFiles.length).toString());
    sourceFiles.forEach(function (pathToSource) {
      gruntTextReplace.replaceFile({
        src: pathToSource,
        dest: settings.dest,
        replacements: settings.replacements
      });
    });
    console.log("End: " + this.getDateTime())
  },

  getDateTime: function(){
  var currentdate = new Date(); 
  dateTime = currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/" 
        + currentdate.getFullYear() + " @ "  
        + currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();
  return dateTime;
  },


  replaceFile: function (settings) {
    var pathToSourceFile = settings.src;
    var pathToDestinationFile = this.getPathToDestination(pathToSourceFile, settings.dest);
    var replacements = settings.replacements;
    var isThereAGenuineReplacement = replacements.reduce(function (previous, current) { 
      return previous || (current.from !== current.to) 
    }, false);
    var isReplacementRequired = (pathToSourceFile !== pathToDestinationFile) || isThereAGenuineReplacement
    if (isReplacementRequired) {
      grunt.file.copy(pathToSourceFile, pathToDestinationFile, {
        process: function (text) {
          return gruntTextReplace.replaceTextMultiple(text, replacements, pathToSourceFile);
        }
      });
    }
  },

  replaceTextMultiple: function (text, replacements, pathToSourceFile) {
    return replacements.reduce(function (newText, replacement) {
      return gruntTextReplace.replaceText({
        text: newText,
        from: replacement.from,
        to: replacement.to
      }, pathToSourceFile);
    }, text);
  },

  replaceText: function (settings, pathToSourceFile) {
    var text = settings.text;
    var from = this.convertPatternToRegex(settings.from);
    var to = this.expandReplacement(settings.to, pathToSourceFile);
    return text.replace(from, to);
  },

  replace: function (settings) {
    var src = grunt.file.expand(settings.src || []);
    var dest = settings.dest;
    var overwrite = settings.overwrite;
    var replacements = settings.replacements;
    var isDestinationDirectory = (/\/$/).test(dest);
    var initialWarnCount = grunt.fail.warncount;

    if (typeof dest === 'undefined' &&
        typeof src === 'undefined' &&
        typeof replacements === 'undefined') {
      grunt.warn(gruntTextReplace.errorMessages.noTargetsDefined);
    } else if (typeof dest === 'undefined' && overwrite !== true) {
      grunt.warn(gruntTextReplace.errorMessages.noDestination);
    } else if (typeof replacements === 'undefined') {
      grunt.warn(gruntTextReplace.errorMessages.noReplacements);
    } else if (typeof dest !== 'undefined' && overwrite === true) {
      grunt.warn(gruntTextReplace.errorMessages.overwriteFailure);
    } else if ((isDestinationDirectory === false && src.length > 1) && overwrite !== true) {
      grunt.warn(gruntTextReplace.errorMessages.multipleSourceSingleDestination);
    } else if (grunt.fail.warncount - initialWarnCount === 0) {
      gruntTextReplace.replaceFileMultiple({
        src: src,
        dest: dest,
        replacements: replacements
      });
    }
  },

  errorMessages: {
    noTargetsDefined: "No targets were found. Remember to wrap functionality " +
      "within a target.",
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

  expandReplacement: function (replacement, pathToSourceFile) {
    if (typeof replacement === 'function') {
      return this.expandFunctionReplacement(replacement, pathToSourceFile);
    } else if (typeof replacement === 'string') {
      return this.expandStringReplacement(replacement, pathToSourceFile);
    } else {
      return gruntTextReplace.expandNonStringReplacement(replacement);
    }
  },

  expandFunctionReplacement: function (replacement, pathToSourceFile) {
    return function () {
      var matchedSubstring = arguments[0];
      var index = arguments[arguments.length - 2];
      var fullText = arguments[arguments.length - 1];
      var regexMatches = Array.prototype.slice.call(arguments, 1,
        arguments.length - 2);
      var returnValue = replacement(matchedSubstring, index, fullText,
        regexMatches, pathToSourceFile);
      return (typeof returnValue === 'string') ?
        gruntTextReplace.processGruntTemplate(returnValue) :
        gruntTextReplace.expandNonStringReplacement(returnValue);
    };
  },

  expandStringReplacement: function (replacement) {
    return gruntTextReplace.processGruntTemplate(replacement);
  },

  expandNonStringReplacement: function (replacement) {
    var isReplacementNullOrUndefined = (typeof replacement === 'undefined') || (replacement === null);
    return isReplacementNullOrUndefined ? '' : String(replacement);
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
