# grunt-text-replace
General purpose text-replacement for grunt.

## About

This plugin automates the process of replacing text in files.

`RegEx` and `String` replacements are supported. 

See the examples below for details.


## Installation

1. Next to your project's [grunt.js gruntfile][getting_started] run: 
`npm install grunt-text-replace`
1. Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-text-replace');
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md


## Usage

I'll show you how it's used through comprehensive examples:

#### `src` 

(array) Source

#### `dest` (string)

#### `overwrite`: `boolean`

#### String replacement

    grunt.initConfig({
      replace: {
        example: {
          src: ['myFile.txt'],
          dest: 'myFileModified.txt'
          replacements: [{
            from: "Hello",
            to: "Good bye"
          }]
        }
      }
    });

    grunt.registerTask('default', 'replace');
    grunt.loadNpmTasks('grunt-text-replace'); 





## Release History
Current version:  0.0.1

## License
Copyright (c) 2012 Jonathan Holmes  
Licensed under the MIT license.
