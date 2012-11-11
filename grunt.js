module.exports = function (grunt) {

  var path = require('path');

  grunt.initConfig({
    
    replace: {
      target: {
        files: {
          src:  ['*.txt', 'test/test.txt'],
          dest: 'foo/'
        },

//        overwrite: true,
        
        replacements: [
          { from: 'Hello', to: 'Good bye' },
          { from: 'Pleased', to: 'Delighted' }
        ]

      },

      // regex_test: {
      //   files: {
      //     src: ['test/test2.txt'],
      //     dest: 'foo/regex.txt'
      //   },

      //   replacements: [
      //     { from: /(.)at/g, to: '$1$1$1at' }
      //   ]
      // }
    }

  });

  grunt.loadTasks('tasks')

  // grunt.registerTask('default', 'replace');

  

};