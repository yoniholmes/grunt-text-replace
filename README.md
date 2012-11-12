# grunt-text-replace
*General purpose text-replacement for grunt.* 

This plugin allows you to replace text in files with *RegEx* or *String* replacement rules.
 


## Installation
Installation follows the same pattern for any grunt plugin:

- In your project's [grunt.js][getting_started] directory, run: 
`npm install grunt-text-replace`
- Alternatively list it as a [dependancy][dependancy] in your *package.json* and run: `npm install`
- Then add this line to your project's *grunt.js*:

```javascript
grunt.loadNpmTasks('grunt-text-replace');
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md
[dependancy]: https://npmjs.org/doc/json.html#dependencies


## Usage

Below we're using:

- a *String* to change Hello to Goodbye
- a *RegEx* to change Foooo to Moooo

```javascript
grunt.initConfig({
  ...
  replace: {
    example: {
      src: ['text/*.txt'],
      dest: 'build/text/',
      replacements: [
        { 
          from: 'Hello', 
          to: 'Good bye' 
        }, 
        { 
          from: /(f|F)(o{2,100})/g, 
          to: 'M$2' 
        }
      ]
    }
  }
  ...
});
```

In the next example we're:

- using [grunt.template][grunt.template] in the output
- overwriting source files

```javascript
grunt.initConfig({
  ...
  replace: {
    another_example: {
      src: ['build/*.html'],
      overwrite: true,
      replacements: [
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

`replace` is a [multi-task][multitask], meaning that it must contain targets, which you can 
name anything you like.

[multitask]: https://github.com/gruntjs/grunt/blob/master/docs/api.md#gruntregistermultitask


### src

Array. *The source of the files that require text replacement.*

`src` must be defined within each target. `src` supports [minimatch][minimatch] paths.

Examples of valid **src** values:

```javascript
src: ['test.txt']             // matches the files 'test.txt' only
src: ['test/*.html']          // matches all html files inside the folder 'test'
src: ['**/*.js']              // matches all .js files inside all subdirctories 
src: ['test.txt', '**/*.js']  // a combination of two of the above
```

[minimatch]: https://github.com/isaacs/minimatch


### dest

String. *The destination for those files that have are matched by the `src`.*

`dest` can refer to either: 

- a single file 
- a single directory

**grunt-text-replace** will throw an error if multiple source files are mapped to
a single file. 

Examples of valid **desc** values:

```javascript 
  dest: 'output.txt'    // sends to 'output.txt' in the grunt.js directory
  dest: 'output/'       // sends the replace files/s to the directory 'output'
```



### overwrite

Boolean. *A switch to allow `grunt-replace-text` to rewrite original files.*

`overwrite` can only be used when a `dest` is not defined, otherwise 
**grunt-text-replace** will throw an error.

Examples of valid **overwrite** values:

```javascript 
  overwrite: true
  overwrite: false
```


### replacements

Array. *The set of text replacements for a given task.*

`replacements` is an array that can contain any number of replacements.

Examples of valid **replacements** values:

```javascript 
  replacements: [{ from: "Red", to: "Blue" }]
  replacements: [
    { from: /colou?r/g, to: "shade" }, 
    {
      from: /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}/g,
      to: "<%= grunt.template.today('dd/mm/yyyy') %>"
    }
  ]
```

### from

String or RegEx. *The old text that you'd like replace.*

`from` can be:

- a plain string
- a regular expression object

For examples, see [replacements](#replacements) above.

### to

String. *The new text that you'd like to change to.*

`to` can be either:

- a plain string
- a string containing a [grunt.template][grunt.template]
- a string containing regex variables `$1`, `$2`, etc


For examples, see [replacements](#replacements) above.

[grunt.template]: https://github.com/gruntjs/grunt/blob/master/docs/api_template.md


## Release History
Current version:  0.1.5



## License
Copyright (c) 2012 Jonathan Holmes  
Licensed under the MIT license.