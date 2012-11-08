module.exports = function (grunt) {

  grunt.initConfig({

    
    text_replace: {
      default: {
        files: ['**/*.txt'],
        
        options: {
          regex: true
        },

        replacements: [
          {
            from: 'Hello', 
            to: 'Good bye' 
          }
        ]

      }
    }

  });



  grunt.registerMultiTask('text_replace', 'A description', function () {
    console.log('TASK')
    grunt.log.writeln(this.target + ': ' + JSON.stringify(this.data));
  });

};