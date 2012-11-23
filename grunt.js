module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    nodeunit: {
      main: ['test/test-text-replace.js'],
      errors: ['test/test-text-replace-errors.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {}
    },
    replace: {
      example: {
        src: ['test/text_files/example.txt'],
        dest: 'test/modified/',
        replacements: [{ 
          from: 'Hello', 
          to: 'Good bye' 
        }, { 
          from: /(f|F)(o{2,100})/g, 
          to: 'M$2' 
        }, { 
          from: /"localhost"/, 
          to: function (matchedWord, index, fullText, regexMatches) {
            return '"www.mysite.com"';
          } 
        }, { 
          from: '<p>Version:</p>', 
          to: '<p>Version: <%= grunt.template.today("yyyy-mm-dd") %></p>'
        }, {
          from: /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}/g,
          to: "<%= grunt.template.today('dd/mm/yyyy') %>"
        }]
      }
    }
  });

/*  
    A note on testing:
    
    There are two kinds of tests:

    - Tests that don't result in an error  
    - Test that do result in an error  (ie. grunt.warn())

    I haven't been able to find a convenient way of testing for grunt.warn() 
    events without enabling '--force' when running grunt. For this reason I've
    set up the 'test' task to just run the main tests, and only if --force is on
    to run the error-throwing tests.

*/

  grunt.loadTasks('tasks');

  grunt.renameTask('test', 'nodeunit');

  grunt.registerTask('test', function () {
    var isForceOn = grunt.option('force') || false;
    var taskList = ['lint', 'nodeunit:main'];
    if (isForceOn) {
      taskList.push('nodeunit:errors');
    }
    grunt.task.run(taskList);
  });

  grunt.registerTask('default', 'test');

  grunt.registerTask('example', 'replace');
};