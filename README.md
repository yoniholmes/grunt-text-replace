# grunt-text-replace
General purpose text-replacement for grunt.

## About

This plugin automates the process of replacing text in files.

Replacement rules can be written as `RegEx` or `String` definitions. 

See the examples below for details.


## Installation

1. Next to your project's [grunt.js gruntfile][getting_started], run: 
`npm install grunt-text-replace`
1. Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-text-replace');
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md


## Usage

`grunt-text-replace` works through a grunt task called `replace`.

---

### replace

**Object**. *The top level grunt task.* 

`replace` goes directly inside `grunt.initConfig({});`. `replace` is is a 
[multi-task.][multitask], meaning that it must contain targets, which you can 
name anything you like.

[multitask]: https://github.com/gruntjs/grunt/blob/master/docs/api.md#gruntregistermultitask

---

### src

**Array**. *The source of the files that require text replacement.*

`src` must be defined within each target. `src` supports [minimatch][minimatch] paths.

#### Examples

```javascript
  src: ['test.txt']             // matches the files 'test.txt' only
  src: ['test/*.html']          // matches all html files inside the folder 'test'
  src: ['**/*.js']              // matches all .js files inside all subdirctories 
  src: ['test.txt', '**/*.js']  // a combination of two of the above
```

[minimatch]: https://github.com/isaacs/minimatch

---

### dest 

**String**. *The destination for those files that have been replaced.*

`dest` can refer to either: a single file, or a single directory. 
`grunt-text-replace` will throw an error if multiple source files are mapped to
a single file. 

#### Examples

```javascript 
  dest: 'output.txt'             // sends the replaced file to 'output.txt' inside the grunt.js directory
  dest: 'output/'                // sends the replace files/s to a directory called 'output'
```

### overwrite

**Boolean**. *A switch to allow `grunt-replace-text` to rewrite original files.*

`overwrite` can only be used when a `dest` is not defined, otherwise 
`grunt-text-replace` will throw an error.


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
