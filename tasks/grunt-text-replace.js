"use strict";

var grunt = require('grunt');
var path = require('path');
var plugin;


module.exports = function (_grunt) {
  // grunt = _grunt
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
    grunt.registerMultiTask('replace', 'Description', this.replace);
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

  replace: function () {
    var src = this.data.src;
    var dest = this.data.dest;
    var replacements = this.data.replacements;
    
// var finalDestination;
// var fileName = path.basename(dest);
// if (this.data.overwrite) {
  
// }
    


// getWriteToPathForFile: function (pathToFile) {
//   var fileName = path.basename(pathToFile), 
//     destination;
//   if (this.isOverwriteTrue) {
//     destination = pathToFile;
//   } else {
//     destination = this.pathToDestination + 
//       (this.isDestinationDirectory ? fileName : '');
//   }
//   return destination;
// },    




    grunt.helper('text-replace-file', src, dest, replacements);
  },

  textReplace: function (fullText, pattern, replacement) {
    var regex = plugin.convertToRegex(pattern);
    var treatedReplacement = plugin.treatReplacement(replacement);
    return fullText.replace(regex, treatedReplacement);
  },

  textReplaceMultiple: function (fullText, allReplacements) {
    return allReplacements.reduce(function (fullText, replacement) {
      return grunt.helper('text-replace', fullText, replacement.from, replacement.to);
    }, fullText);
  },

  textReplaceFile: function (src, dest, replacements) {
    grunt.file.copy(src, dest, {
      process: function (fullText) {
        return grunt.helper('text-replace-multiple', fullText, replacements);
      }
    });
  },

  
  // TO DO: rename this to something more useful
  convertToRegex: function (pattern) {
    return typeof pattern === 'string' ? new RegExp(pattern, "g") : pattern;
  },

  // TO DO: rename this to something more useful, maybe split into smaller functions
  treatReplacement: function (replacement) {
    var alteredReplacement;
    switch (typeof replacement) {
      case 'function':
        alteredReplacement = function () {
          var matchedSubstring = arguments[0];
          var index = arguments[arguments.length - 2];
          var fullText = arguments[arguments.length - 1];
          var regexMatches = Array.prototype.slice.call(arguments, 1, arguments.length - 2);
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



