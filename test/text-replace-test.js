'use strict';

var grunt = require('grunt');
var gruntTextReplace = require('../lib/grunt-text-replace');

exports.replace = {
  'Test core replacement functionality': {
    'Test string replacements': function (test) {

      console.log('Here is replace: ', gruntTextReplace);
      
      test.equal(gruntTextReplace.replace({
        text: 'Hello world', 
        from: 'Hello', 
        to: 'Goodbye'
      }), 'Goodbye world');



      // test.equal(grunt.helper('text-replace', 'Hello world', 'Hello', 'Goodbye'), 'Goodbye world');
      // test.notEqual(grunt.helper('text-replace', 'Hello w000rld', 'w0*rld', 'world'), 'Hello world');
      // test.equal(grunt.helper('text-replace', 'Hello (*foo.)', '(*foo.)', 'world'), 'Hello world');
      // test.equal(grunt.helper('text-replace', 'Hello \\foo', '\\', ''), 'Hello foo');
      // test.equal(grunt.helper('text-replace', 'Foo bar bar', 'bar', 'foo'), 'Foo foo foo');
      // test.equal(grunt.helper('text-replace', 'Foo bar bar', 'bar', 'Foo bar'), 'Foo Foo bar Foo bar');
      // test.done();
      test.done();
    }
  }
};
