module.exports = function (grunt) {

  grunt.initConfig({

    
    text_replace: {
      default: {
        files: {
          src:  ['*.txt'],
          dest: 'foo.txt'
        },
        
        options: {
          regex: true
        },

        replacements: [
          {
            from: 'Hello', 
            to: 'Good bye' 
          },
          {
            from: 'Pleased', 
            to: 'Delighted' 
          }
        ]

      }
    }

  });

  grunt.registerTask('default', 'text_replace');

  grunt.registerMultiTask('text_replace', 'A description', function () {
    var allSourceFiles = this.data.files.src,
        allSourceFilePaths = grunt.file.expandFiles(allSourceFiles),
        pathToDestinationDirectory = this.data.files.dest;

    var allReplacements = this.data.replacements;

    allSourceFilePaths.forEach(function (pathToFile) {
      grunt.file.copy(pathToFile, pathToDestinationDirectory, {
        process: function (fileContents) {
          allReplacements.forEach(function (replacement) {
            console.log(replacement)
            fileContents = fileContents.replace(replacement.from, replacement.to);
          })
          return fileContents;
        }
      });
    })
  });

};