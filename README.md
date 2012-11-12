# grunt-text-replace
General purpose text-replacement for grunt.

This plugin allows you to replace text in files with *RegEx* or *String* replacement rules.

See the examples below for details.
 


## Installation
Installation follows the same pattern for any grunt plugin:

1. Next to your project's [grunt.js gruntfile][getting_started], run: 
`npm install grunt-text-replace`
1. Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-text-replace');
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md



## Usage

Here's an example of changing some text files:

```javascript
grunt.initConfig({
  ...
  replace: {
    urls: {
      src: ['text/*.txt'],
      dest: 'build/text/',
      replacements: [
        { from: 'Hello', to: 'Good bye' }, 
        { from: /(f|F)(o{2,100})/g, to: 'M$2' }
      ]
    }
  }
  ...
});
```

Here's an example of overwriting files that have already been copied to a build 
directory:

```javascript
grunt.initConfig({
  ...
  replace: {
    urls: {
      src: ['build/*.html'],
      overwrite: true,
      replacements: [
        { 
          from: '"localhost"', 
          to: '"www.mysite.com"' 
        },
        { 
          from: '<p>Version:</p>', 
          to: '<p>Version: <%= grunt.template.today("yyyy-mm-dd") %></p>'
        }
      ]
    }
  }
  ...
});
```



## API reference

### replace

Object. *The top level grunt task.* 

`replace` is is a [multi-task][multitask], meaning that it must contain targets, which you can 
name anything you like.

[multitask]: https://github.com/gruntjs/grunt/blob/master/docs/api.md#gruntregistermultitask


### *replace.task*.src

Array. *The source of the files that require text replacement.*

`src` must be defined within each target. `src` supports [minimatch][minimatch] paths.

##### Examples

```javascript
// One of:
src: ['test.txt']             // matches the files 'test.txt' only
src: ['test/*.html']          // matches all html files inside the folder 'test'
src: ['**/*.js']              // matches all .js files inside all subdirctories 
src: ['test.txt', '**/*.js']  // a combination of two of the above
```

[minimatch]: https://github.com/isaacs/minimatch


### *replace.task*.dest

String. *The destination for those files that have are matched by the `src`.*

`dest` can refer to either: a single file, or a single directory. 
`grunt-text-replace` will throw an error if multiple source files are mapped to
a single file. 

##### Examples

```javascript 
  dest: 'output.txt'    // sends to 'output.txt' in the grunt.js directory
  dest: 'output/'       // sends the replace files/s to the directory 'output'
```



### *replace.task*.overwrite

Boolean. *A switch to allow `grunt-replace-text` to rewrite original files.*

`overwrite` can only be used when a `dest` is not defined, otherwise 
`grunt-text-replace` will throw an error.



### *replace.task*.replacements

Array. *The set of text replacements for a given task.*

`replacements` is an array that can contain any number of replacements.


### *replace.task.replacements*.from

String or RegEx. *The old text that you'd like replace.*

`from` matches existing text and can be a RegEx object, or a plain string. 

### *replace.task.replacements*.to

String. *The new text that you'd like to change to.*

`to` supports [grunt.template] replacements also.

Note that if you use a RegEx 'from' object, any matched items will be available
to use in the 'to' string via the RegEx matching variables '$1, $2', etc.



## Release History
Current version:  0.1.3



## License
Copyright (c) 2012 Jonathan Holmes  
Licensed under the MIT license.