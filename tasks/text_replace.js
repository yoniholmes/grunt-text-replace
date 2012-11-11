// Copyright (c) 2012 Jonathan Holmes. 
// Licensed under the MIT license. 

module.exports = function (grunt) {

var path = require('path');

  grunt.registerMultiTask('replace', 'A description', function () {

    var allSourceFiles = this.data.src,
        allSourceFilePaths = grunt.file.expandFiles(allSourceFiles),
        allReplacements = this.data.replacements,
        pathToDestination = this.data.dest,
        isOverwriteTrue = (typeof this.data.overwrite !== 'undefined') && this.data.overwrite,
        isDestinationDefined = typeof pathToDestination !== 'undefined',
        isDirectory = /\/$/.test(pathToDestination),
        numerOfSourceFiles = allSourceFiles.length;


    if (isDestinationDefined === false && isOverwriteTrue === false) {
      grunt.fatal('Destination is not defined! If you want to overwrite files, then make sure to set overwrite: true. If you don\'t wish to overwrite, then make sure to set a destination')
    }

    if (isDestinationDefined && isOverwriteTrue) {
      grunt.fatal('You\'ve set overwrite to true. If you want to overwrite files, then remove the destination. If you want to send files to a destination, then ensure overwrite is not set to true')
    }

    if (numerOfSourceFiles === 0) {
      grunt.fatal('No source files found')
    }

    if (isDirectory === false && numerOfSourceFiles > 1 && isOverwriteTrue === false) {
      grunt.fatal('Cannot write multiple files to same file. If you wish to export to a directory, make sure there is a trailing slash on the destination. If you wish to write to a single file, make sure there is only one source file')
    }   



    allSourceFilePaths.forEach(function (pathToFile) {
      var fileName = path.basename(pathToFile),
          dirname = path.dirname(pathToFile);
          destination = isDirectory ? pathToDestination + fileName : pathToDestination;

      if (isOverwriteTrue) {
        destination = pathToFile
      }

      grunt.file.copy(pathToFile, destination, {
        process: function (fileContents) {
          allReplacements.forEach(function (replacement) {
            fileContents = fileContents.replace(replacement.from, replacement.to);
          })
          return fileContents;
        }
      });
    })
  });

};