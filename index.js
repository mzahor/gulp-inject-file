var es = require('event-stream');
var fs = require('fs');
var _ = require('lodash');
var path = require('path')
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-inject-file';

function gulpInjectFile(opts) {
    const FILENAME_PATTERN = '\\s*([\\w\\-\\_\\.\\\\\\/]+)';
    const FILENAME_MARKER = '<filename>';

    function doInject(file, callback) {
        var isStream = file.contents && typeof file.contents.on === 'function' && typeof file.contents.pipe === 'function';
        var isBuffer = file.contents instanceof Buffer;

        if (isBuffer) {
            var content = file.contents.toString('utf8');
            var injectPattern = '(\\s*)' + opts.pattern.replace(FILENAME_MARKER, FILENAME_PATTERN);
            var regex = new RegExp(injectPattern, 'm');
            var fileName, whitespace;

            while (currMatch = regex.exec(content)) {
                match = currMatch[0];
                whitespace = currMatch[1];
                fileName = currMatch[2];

                var injectContent = _(fs.readFileSync(path.join(file.base, fileName), 'utf8').split('\n'))
                    .map(function(line) {
                        return whitespace + line;
                    })
                    .value()
                    .join('');

                content = content.replace(match, injectContent);
            }

            file.contents = new Buffer(content);
            callback(null, file);
        } 
        else if (isStream) {
            throw new PluginError(PLUGIN_NAME, 'Streams are not supported!');
        }
    }

    return es.map(doInject);
};

module.exports = gulpInjectFile;