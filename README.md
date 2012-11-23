# grunt-text-replace [!['Build status'][travis_image_url]][travis_page_url]

  [travis_image_url]: https://api.travis-ci.org/yoniholmes/grunt-text-replace.png
  [travis_page_url]: https://travis-ci.org/yoniholmes/grunt-text-replace



General purpose text replacement for grunt. 

Allows you to replace text in files using strings, regexs or functions.
 

## Installation
In your project's [gruntfile][getting_started] directory, run: 

```bash
npm install grunt-text-replace
```

Then add this line to your project's [gruntfile][getting_started]:

```javascript
grunt.loadNpmTasks('grunt-text-replace');
```

  [grunt]: http://gruntjs.com/
  [getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md


## Usage


```javascript
replace: {
  example: {
    src: ['text/*.txt'],             // source files array (supports minimatch)
    dest: 'build/text/',             // destination directory or file
    replacements: [{ 
      from: 'Red',                   // string replacement
      to: 'Blue' 
    }, { 
      from: /(f|F)(o{2,100})/g,      // regex replacement ('Fooo' to 'Mooo')
      to: 'M$2' 
    }, {
      from: 'Foo',
      to: function (matchedWord) {   // callback replacement
        return matchedWord + ' Bar';
      }
    }]
  }
}
```

Here's another example using [grunt.template][grunt.template], and overwriting 
original source files:

```javascript
replace: {
  another_example: {
    src: ['build/*.html'],
    overwrite: true,                 // overwrite matched source files
    replacements: [{ 
      from: /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}/g,
      to: "<%= grunt.template.today('dd/mm/yyyy') %>"
    }]
  }
}
```



## API reference


### replace 

*replace* is the top level task that goes in your `grunt.initConfig({})`. It is
a [multi-task][multitask], meaning that it must contain targets, which you can 
name anything you like.

[multitask]: https://github.com/gruntjs/grunt/blob/master/docs/api.md#gruntregistermultitask


### src

*src* is an array of source files to be replaced, and is required. 
It supports [minimatch][minimatch] paths.

[minimatch]: https://github.com/isaacs/minimatch


### dest

*dest* is the destination for files to be replaced, and can refer to either a:

- file: `'path/output.txt'`
- directory: `'path/'`

grunt-text-replace will throw an error if multiple source files are mapped to
a single file. 



### overwrite

*overwrite* is used if all you need to do is overwrite existing files. 
To use it, omit *dest*, otherwise 
grunt-text-replace will throw an error. You can only use one or the other. 


### replacements

*replacements* is an array of *from* and *to* replacements. See the 
[examples](#usage) above.


### from

*from* is the old text that you'd like replace. It can be a:

- plain string: `'Red'` *matches all instances of 'Red' in file*
- regular expression object:  `/Red/g` *same as above*


### to

*to* is the replacement. It can be a:

- plain string
- string containing a [grunt.template][grunt.template]
- string containing regex variables `$1`, `$2`, etc
- combination of the above
- function where the return value will be used as the replacement text (supports 
[grunt.template][grunt.template])

#### function
Where *to* is a function, the function receives 4 parameters:

1. **matchedWord**:  the matched word
2. **index**:  an integer representing point where word was found in a text
3. **fullText**:  the full original text
4. **regexMatches**:  an array containing all regex matches, empty if none defined or found.


```javascript
// Where the original source file text is:  "Hello world"

replacements: [{ 
  from: /wor(ld)/g, 
  to: function (matchedWord, index, fullText, regexMatches) {
    // matchedWord:  "world"
    // index:  6  
    // fullText:  "Hello world"
    // regexMatches:  ["ld"]
    return 'planet';   //
  }
}]

// The new text will now be:  "Hello planet"
```


[grunt.template]: https://github.com/gruntjs/grunt/blob/master/docs/api_template.md


## Release History
- v0.2.5 - 2012/11/23.  Function replacements now support grunt.template.
- v0.2.0 - 2012/11/21.  Added tests, refactored internals, strings now replace globally within a file, updated documentation.
- v0.1.0 - 2012/11/12.  Initial release.

Patch releases will generally remain undocumented in this release history. 
I'll do so if there's enough reason for it, such as a functionality tweak, or 
significant bug fix. For more detail see the source.



## License
Copyright (c) 2012 Jonathan Holmes  
Licensed under the MIT license.