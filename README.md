# grunt-text-replace
General purpose text-replacement tool for grunt.

## About this plugin
This plugin can be used to automate the process of replacing text in x`files.

`RegEx` and `String` replacements are supported.


## How to use

### Installation

As with any other grunt-plugin:

- In your grunt.js directory, install the plugin:
 `npm install grunt-text-replace`.
- Alternatively, specify the plugin as a 
[dependancy](https://npmjs.org/doc/json.html#dependencies) in your package.json, 
and run `npm install`.
- Load the plugin in your grunt.js: `grunt.loadNpmTasks('grunt-text-replace')`
- Run the replace task: 

### Example uses

I'll show you how it's used through comprehensive examples:

#### String replacement

    grunt.initConfig({
      replace: {
        example: {
          files: {
            src: ['myFile.txt'],
            dest: 'myFileModified.txt'
          },
          replacements: [{
            from: "Hello",
            to: "Good bye"
          }]
        }
      }
    });

    grunt.registerTask('default', 'replace');
    grunt.loadNpmTasks('grunt-text-replace'); 

