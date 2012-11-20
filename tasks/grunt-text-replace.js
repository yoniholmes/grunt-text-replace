"use strict";

var grunt = require('grunt'),
  plugin;


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
    this.registerTextReplaceHelper();
    this.registerTextReplaceMultipleHelper();
    this.registerTextReplaceFileHelper();
  },

  registerTextReplaceTask: function () {
    //grunt.registerPluginTask();
  },

  registerTextReplaceHelper: function () {
    grunt.registerHelper('text-replace', this.textReplace);
  },

  registerTextReplaceMultipleHelper: function () {
    grunt.registerHelper('text-replace-multiple', this.textReplaceMultiple);
  },

  registerTextReplaceFileHelper: function () {
    grunt.registerHelper('text-replace-file', this.textReplaceFile);
  },

  textReplace: function (fullText, pattern, replacement) {
    var regex = plugin.convertToRegex(pattern),
      treatedReplacement = plugin.treatReplacement(replacement);
    return fullText.replace(regex, treatedReplacement);
  },

  textReplaceMultiple: function (fullText, allReplacements) {
    return allReplacements.reduce(function (fullText, replacements) {
      return grunt.helper('text-replace', fullText, replacements.from, replacements.to);
    }, fullText);
  },

  textReplaceFile: function (src, dest, replacements) {
    grunt.file.copy(src, dest, {
      process: function (fullText) {
        return grunt.helper('text-replace-multiple', fullText, replacements);
      }
    });
  },

  convertToRegex: function (pattern) {
    return typeof pattern === 'string' ? new RegExp(pattern, "g") : pattern;
  },

  treatReplacement: function (replacement) {
    var alteredReplacement;
    switch (typeof replacement) {
      case 'function':
        alteredReplacement = function () {
          var matchedSubstring = arguments[0],
            index = arguments[arguments.length - 2],
            fullText = arguments[arguments.length - 1],
            regexMatches = Array.prototype.slice.call(arguments, 1, arguments.length - 2);
          return replacement(matchedSubstring, index, fullText, regexMatches);
        };
        break;
      case 'string':
        alteredReplacement = grunt.template.process(replacement);
        break;
    }
    return alteredReplacement;
  }
};



