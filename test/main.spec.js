var injectFilePlugin = require('../');
var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var expect = require('chai').expect;
var gutil = require('gulp-util');
require('mocha');

describe('gulp-inject-file', function() {
  describe('injectFilePlugin()', function() {
    it('should inject file by pattern', function(done) {
      var file = new gutil.File({
        path: 'test/fixtures/main.xml',
        cwd: 'test/',
        base: 'test/',
        contents: fs.readFileSync('test/fixtures/main.xml')
      });

      var stream = injectFilePlugin(
      	{
      		pattern: '<!-- inject\\:<filename> -->'
      	});

      stream.on('data', function(newFile) {
        expect(newFile).to.exist;
        expect(newFile.contents).to.exist;

        expect(newFile.contents.toString('utf8')).to.equal(fs.readFileSync('test/expected/main.xml', 'utf8'));
        done();
      });

      stream.write(file);
      stream.end();
    });
  });
});
