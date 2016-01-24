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
      var data = this.data;
      var srcFiles = this.files.forEach(function(elem){
        gruntTextReplace.replace({
          src: elem.src,
          dest: elem.dest,
          overwrite: data.overwrite,
          replacements: data.replacements
        });
      });
    });
};
