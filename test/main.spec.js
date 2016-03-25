var injectFilePlugin = require('../');
var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var expect = require('chai').expect;
var gutil = require('gulp-util');
var sinon = require('sinon');
require('mocha');

describe('gulp-inject-file', function() {
    describe('injectFilePlugin()', function() {
        it('should inject file by pattern', function(done) {
            var file = new gutil.File({
                path: 'test/fixtures/inject/main.xml',
                cwd: 'test/fixtures/inject/',
                base: 'test/fixtures/inject/',
                contents: fs.readFileSync('test/fixtures/inject/main.xml')
            });

            var stream = injectFilePlugin({
                pattern: '<!-- inject\\:<filename> -->'
            });

            stream.on('data', function(newFile) {
                expect(newFile).to.exist;
                expect(newFile.contents).to.exist;
                expect(newFile.contents.toString('utf8')).to.equal(fs.readFileSync('test/expected/inject/main.xml', 'utf8'));
                done();
            });

            stream.write(file);
            stream.end();
        });

        it('should inject file using default', function(done) {
            var file = new gutil.File({
                path: 'test/fixtures/inject/main.xml',
                cwd: 'test/fixtures/inject/',
                base: 'test/fixtures/inject/',
                contents: fs.readFileSync('test/fixtures/inject/main.xml')
            });

            var stream = injectFilePlugin();

            stream.on('data', function(newFile) {
                expect(newFile).to.exist;
                expect(newFile.contents).to.exist;
                expect(newFile.contents.toString('utf8')).to.equal(fs.readFileSync('test/expected/inject/main.xml', 'utf8'));
                done();
            });

            stream.write(file);
            stream.end();
        });
		
		it('should inject file within a line by pattern', function(done) {
			var file = new gutil.File({
				path: 'test/fixtures/withinline/main.xml',
				cwd: 'test/fixtures/withinline/',
				base: 'test/fixtures/withinline/',
				contents: fs.readFileSync('test/fixtures/withinline/main.xml')
			});
			
			var stream = injectFilePlugin({
				pattern: '<!-- inject\\:<filename> -->'
			});
			
			stream.on('data', function(newFile) {
				expect(newFile).to.exist;
				expect(newFile.contents).to.exist;
				expect(newFile.contents.toString('utf8')).to.equal(fs.readFileSync('test/expected/withinline/main.xml', 'utf8'));
				done();
			});
			
			stream.write(file);
            stream.end();
		});
		
		it('should inject file within a line using default pattern', function(done) {
			var file = new gutil.File({
				path: 'test/fixtures/withinline/main.xml',
				cwd: 'test/fixtures/withinline/',
				base: 'test/fixtures/withinline/',
				contents: fs.readFileSync('test/fixtures/withinline/main.xml')
			});
			
			var stream = injectFilePlugin();
			
			stream.on('data', function(newFile) {
				expect(newFile).to.exist;
				expect(newFile.contents).to.exist;
				expect(newFile.contents.toString('utf8')).to.equal(fs.readFileSync('test/expected/withinline/main.xml', 'utf8'));
				done();
			});
			
			stream.write(file);
            stream.end();
		});

        describe('transformation', function() {
            var file, transformMock, pattern, options;

            beforeEach(function() {
                file = new gutil.File({
                    path: 'test/fixtures/transform/main.xml',
                    cwd: 'test/fixtures/transform/',
                    base: 'test/fixtures/transform/',
                    contents: fs.readFileSync('test/fixtures/transform/main.xml')
                });

                transformMock = sinon.mock();
                pattern = '<!-- inject\\:<filename> -->';
                options = {
                    pattern: pattern,
                    transform: transformMock
                };
            });

            it('should call transformation function for each injected file if it is provided', function(done) {
                options.transform.twice().returns('');

                var stream = injectFilePlugin(options);

                stream.on('data', function() {
                    transformMock.verify();
                    done();
                });

                stream.write(file);
                stream.end();
            });

            it('should call transformation function with content as the first argument and path as the second', function(done) {
                options.transform.twice().withArgs('<sub-item1 />\n<sub-item2 />', 'test/fixtures/transform/sections/subitem.xml').returns('');

                var stream = injectFilePlugin(options);

                stream.on('data', function() {
                    transformMock.verify();
                    done();
                });

                stream.write(file);
                stream.end();
            });

            it('should use transformation function result as injection content', function(done) {
                options.transform.twice().returns('transformed');

                var stream = injectFilePlugin(options);

                stream.on('data', function(newFile) {
                    expect(newFile.contents.toString('utf8')).to.equal(fs.readFileSync('test/expected/transform/main.xml', 'utf8'));
                    done();
                });

                stream.write(file);
                stream.end();
            });
        });

    });
});
