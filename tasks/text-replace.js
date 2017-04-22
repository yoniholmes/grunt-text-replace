/*
 * grunt-text-replace
 * https://github.com/Yoni/grunt-4-test
 *
 * Copyright (c) 2013 Jonathan Holmes
 * Licensed under the MIT license.
 */

var gruntTextReplace = require('../lib/grunt-text-replace');

module.exports = function(grunt) {



  // Please see the grunt documentation for more information regarding task
  // creation: https://github.com/gruntjs/grunt/blob/devel/docs/toc.md

  grunt.registerMultiTask('replace',
    'General purpose text replacement for grunt. Allows you to replace ' +
    'text in files using strings, regexs or functions.',
    function () {
	  var srcs = this.data.src;
	  if (!srcs && this.data.files)
        srcs = Array.prototype.concat.apply([], this.data.files.map(function(filesHash){
          return filesHash.src
        }));
      gruntTextReplace.replace({
        src: srcs,
        dest: this.data.dest,
        overwrite: this.data.overwrite,
        replacements: this.data.replacements
      });
    });
};
