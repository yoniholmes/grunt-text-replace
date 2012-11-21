"use strict";

var grunt = require('grunt');
var fs = require('fs');

exports['test-text-replace'] = {

  'Test error handling': {
    setUp: function (done) {
      grunt.file.copy('test/text_files/test.txt', 'test/temp/testA.txt');
      grunt.file.copy('test/text_files/test.txt', 'test/temp/testB.txt');
      done();
    },
    
    tearDown: function (done) {
      fs.unlinkSync('test/temp/testA.txt');
      fs.unlinkSync('test/temp/testB.txt');
      fs.rmdirSync('test/temp');
      done();
    },

    'Test no source files': function (test) {
      var warnCountBefore = grunt.fail.warncount;
      grunt.helper('replace', {
        dest: 'test/temp/',
        replacements: [{ from: 'Hello', to: 'Good bye' }]
      });
      test.equal(grunt.fail.warncount - warnCountBefore, 1);
      grunt.helper('replace', {
        src: 'test/noSuchFile.txt',
        dest: 'test/temp/',
        replacements: [{ from: 'Hello', to: 'Good bye' }]
      });
      test.equal(grunt.fail.warncount - warnCountBefore, 2);
      grunt.helper('replace', {
        src: 'test/temp/testA.txt',
        dest: 'test/temp/',
        replacements: [{ from: 'Hello', to: 'Good bye' }]
      });
      test.equal(grunt.fail.warncount - warnCountBefore, 2);
      test.done();
    },

    'Test no destination found': function (test) {
      var warnCountBefore = grunt.fail.warncount;
      grunt.helper('replace', {
        src: 'test/temp/testA.txt',
        replacements: [{ from: 'Hello', to: 'Good bye' }]
      });
      test.equal(grunt.fail.warncount - warnCountBefore, 1);
      grunt.helper('replace', {
        src: 'test/temp/testA.txt',
        overwrite: true,
        replacements: [{ from: 'Hello', to: 'Good bye' }]
      });
      test.equal(grunt.fail.warncount - warnCountBefore, 1);
      grunt.helper('replace', {
        src: 'test/temp/testA.txt',
        dest: 'test/temp/',
        replacements: [{ from: 'Hello', to: 'Good bye' }]
      });
      test.equal(grunt.fail.warncount - warnCountBefore, 1);
      test.done();
    },

    'Test no replacements found': function (test) {
      var warnCountBefore = grunt.fail.warncount;
      grunt.helper('replace', {
        src: 'test/temp/testA.txt',
        dest: 'test/temp/'
      });
      test.equal(grunt.fail.warncount - warnCountBefore, 1);
      grunt.helper('replace', {
        src: 'test/temp/testA.txt',
        dest: 'test/temp/',
        replacements: [{ from: 'Hello', to: 'Good bye' }]
      });
      test.equal(grunt.fail.warncount - warnCountBefore, 1);
      test.done();
    },

    'Test overwrite failure': function (test) {
      var warnCountBefore = grunt.fail.warncount;
      grunt.helper('replace', {
        src: 'test/temp/testA.txt',
        dest: 'test/temp/',
        overwrite: true,
        replacements: [{ from: 'Hello', to: 'Good bye' }]
      });
      test.equal(grunt.fail.warncount - warnCountBefore, 1);
      grunt.helper('replace', {
        src: 'test/temp/testA.txt',
        overwrite: true,
        replacements: [{ from: 'Hello', to: 'Good bye' }]
      });
      test.equal(grunt.fail.warncount - warnCountBefore, 1);
      test.done();
    },

    'Test destination error': function (test) {
      var warnCountBefore = grunt.fail.warncount;
      grunt.helper('replace', {
        src: 'test/temp/*',
        dest: 'test/temp',
        replacements: [{ from: 'Hello', to: 'Good bye' }]
      });
      test.equal(grunt.fail.warncount - warnCountBefore, 1);
      grunt.helper('replace', {
        src: 'test/temp/*',
        dest: 'test/temp/testA.txt',
        replacements: [{ from: 'Hello', to: 'Good bye' }]
      });
      test.equal(grunt.fail.warncount - warnCountBefore, 2);
      grunt.helper('replace', {
        src: 'test/temp/testA.txt',
        dest: 'test/temp/testB.txt',
        replacements: [{ from: 'Hello', to: 'Good bye' }]
      });
      test.equal(grunt.fail.warncount - warnCountBefore, 2);
      test.done();
    }

  }

};