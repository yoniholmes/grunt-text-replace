var grunt = require('grunt');
var path = require('path');
var gruntTextReplace = {};


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
  replaceText: function (settings) {
    var text = settings.text;
    var from = this.convertPatternToRegex(settings.from);
    var to = this.expandReplacement(settings.to);
    return text.replace(from, to);
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

  replaceFileMultiple: function (settings) {
    var sourceFiles = grunt.file.expand(settings.src);
    sourceFiles.forEach(function (pathToSource) {
      gruntTextReplace.replaceFile({
        src: pathToSource,
        dest: settings.dest,
        replacements: settings.replacements        
      });
    });
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
        grunt.template.process(returnValue) : returnValue;
    };
  },

  expandStringReplacement: function (replacement) {
    return grunt.template.process(replacement);
  }

}
