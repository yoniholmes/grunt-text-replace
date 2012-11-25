"use strict";

var grunt = require('grunt');
var path = require('path');
var plugin;


module.exports = function () {
  plugin.initialisePlugin();
};


plugin = {
  initialisePlugin: function () {
    this.registerTasks();
    this.registerHelpers();
  },

  registerTasks: function () {
    this.registerTextReplaceTask();
  },

  registerHelpers: function () {
    this.registerReplaceHelper();
    this.registerTextReplaceHelper();
    this.registerTextReplaceMultipleHelper();
    this.registerTextReplaceFileHelper();
    this.registerTextReplaceFileMultipleHelper();
  },

  registerTextReplaceTask: function () {
    grunt.registerMultiTask('replace', 'Description', this.replaceTask);
  },

  replaceTask: function () {
    grunt.helper('replace', {
      src: this.data.src,
      dest: this.data.dest,
      overwrite: this.data.overwrite,
      replacements: this.data.replacements
    });
  },

  registerReplaceHelper: function () {
    grunt.registerHelper('replace', this.replaceHelper);
  },

  registerTextReplaceHelper: function () {
    grunt.registerHelper('text-replace', this.textReplaceHelper);
  },

  registerTextReplaceMultipleHelper: function () {
    grunt.registerHelper('text-replace-multiple', this.textReplaceMultipleHelper);
  },

  registerTextReplaceFileHelper: function () {
    grunt.registerHelper('text-replace-file', this.textReplaceFileHelper);
  },

  registerTextReplaceFileMultipleHelper: function () {
    grunt.registerHelper('text-replace-file-multiple', this.textReplaceFileMultipleHelper);
  },

  textReplaceHelper: function (fullText, from, to) {
    var regex = plugin.convertMatchToRegex(from);
    var expandedReplacement = plugin.expandReplacement(to);
    return fullText.replace(regex, expandedReplacement);
  },

  textReplaceMultipleHelper: function (fullText, allReplacements) {
    return allReplacements.reduce(function (fullText, replacement) {
      return grunt.helper('text-replace', fullText, replacement.from, replacement.to);
    }, fullText);
  },

  textReplaceFileHelper: function (pathToSource, dest, replacements) {
    var isDestinationDirectory = (/\/$/).test(dest);
    var fileName = path.basename(pathToSource);
    var pathToDestination;
    if (typeof dest === 'undefined') {
      pathToDestination = pathToSource;
    } else {
      pathToDestination = dest + (isDestinationDirectory ? fileName : '');
    }
    grunt.file.copy(pathToSource, pathToDestination, {
      process: function (fullText) {
        return grunt.helper('text-replace-multiple', fullText, replacements);
      }
    });  
  },

  textReplaceFileMultipleHelper: function (src, dest, replacements) {
    var sourceFiles = grunt.file.expandFiles(src);
    sourceFiles.forEach(function (pathToSource) {
      grunt.helper('text-replace-file', pathToSource, dest, replacements);
    });
  },

  replaceHelper: function (settings) {
    var src = grunt.file.expandFiles(settings.src || []);
    var dest = settings.dest;
    var overwrite = settings.overwrite;
    var replacements = settings.replacements;
    var isDestinationDirectory = (/\/$/).test(dest);
    var initialWarnCount = grunt.fail.warncount;

    if (typeof dest === 'undefined' &&
        typeof src === 'undefined' &&
        typeof replacements === 'undefined') {
      grunt.warn(plugin.errorMessages.noTargetsDefined);
    } else if (src.length === 0) {
      grunt.warn(plugin.errorMessages.noSourceFiles);
    } else if (typeof dest === 'undefined' && overwrite !== true) {
      grunt.warn(plugin.errorMessages.noDestination);
    } else if (typeof replacements === 'undefined') {
      grunt.warn(plugin.errorMessages.noReplacements);
    } else if (typeof dest !== 'undefined' && overwrite === true) {
      grunt.warn(plugin.errorMessages.overwriteFailure);
    } else if (isDestinationDirectory === false && src.length > 1) {
      grunt.warn(plugin.errorMessages.multipleSourceSingleDestination);
    } else if (grunt.fail.warncount - initialWarnCount === 0) {
      grunt.helper('text-replace-file-multiple', src, dest, replacements);
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

  convertMatchToRegex: function (pattern) {
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
    var alteredReplacement;
    switch (typeof replacement) {
      case 'function':
        alteredReplacement = function () {
          var matchedSubstring = arguments[0];
          var index = arguments[arguments.length - 2];
          var fullText = arguments[arguments.length - 1];
          var regexMatches = Array.prototype.slice.call(arguments, 1, arguments.length - 2);
          var returnValue = replacement(matchedSubstring, index, fullText, 
            regexMatches);
          return (typeof returnValue === 'string') ? 
            grunt.template.process(returnValue) : returnValue;
        };
        break;
      case 'string':
        alteredReplacement = grunt.template.process(replacement);
        break;
    }
    return alteredReplacement;
  }
};



