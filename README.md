# grunt-text-replace
General purpose text-replacement tool for grunt.

## About this plugin


This plugin can be used to automate the process of replacing text in x`files.

`RegEx` and `String` replacements are supported.


## Getting Started

### Installation

Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-text-replace`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-plugin');
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md


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





## Documentation
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Jonathan Holmes  
Licensed under the MIT license.
