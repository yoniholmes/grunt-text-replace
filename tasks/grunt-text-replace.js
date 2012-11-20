"use strict";

var grunt = require('grunt'),
  plugin;


module.exports = function (referenceToGrunt) {
  grunt = referenceToGrunt;
  plugin.registerTextReplaceHelper();
  plugin.registerTextReplaceMultipleHelper();
  plugin.registerTextReplaceTask();
};


plugin = {
  registerTextReplaceHelper: function () {
    grunt.registerHelper('text-replace', function (fullText, pattern, replacement) {
      return fullText.replace(plugin.convertToRegex(pattern), plugin.treatReplacement(replacement));
    });
  },

  registerTextReplaceMultipleHelper: function () {
    grunt.registerHelper('text-replace-multiple', function (fullText, allReplacements) {
      return allReplacements.reduce(function (fullText, replacements) {
        return grunt.helper('text-replace', fullText, replacements.from, replacements.to);
      }, fullText);
    });
  },

  registerTextReplaceTask: function () {
    //grunt.registerPluginTask();
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



