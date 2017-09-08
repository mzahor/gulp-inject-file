const es = require('event-stream')
const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const gutil = require('gulp-util')
const PluginError = gutil.PluginError

const PLUGIN_NAME = 'gulp-inject-file'

function gulpInjectFile (opts) {
  // Unescaped \s*([\w@_\-.\\\/]+)\s*
  const FILENAME_PATTERN = '\\s*([\\w@_\\-.\\\\/]+)\\s*'
  const FILENAME_MARKER = '<filename>'
  const DEFAULT_PATTERN = '<!--\\s*inject:<filename>-->'

  opts = opts || {}
  opts.pattern = opts.pattern || DEFAULT_PATTERN

  function doInject (file, callback) {
    const isStream = file.contents && typeof file.contents.on === 'function' && typeof file.contents.pipe === 'function'
    const isBuffer = file.contents instanceof Buffer

    if (isBuffer) {
      let content = file.contents.toString('utf8')
      const injectPattern = '^([ \\t]*)(.*?)' + opts.pattern.replace(FILENAME_MARKER, FILENAME_PATTERN)
      const regex = new RegExp(injectPattern, 'm')
      let fileName, textBefore, whitespace, currMatch, match

      while ((currMatch = regex.exec(content))) {
        match = currMatch[0]
        whitespace = currMatch[1]
        textBefore = currMatch[2]
        fileName = currMatch[3]

        var injectContent = whitespace + textBefore +
          _(getFileContent(path.join(path.dirname(file.path), fileName)).split(/\r?\n/))
            .map(function (line, i) {
              return (i > 0) ? whitespace + line : line
            })
            .join('\n')

        content = content.replace(match, function () { return injectContent })
      }

      file.contents = Buffer.from(content)
      callback(null, file)
    } else if (isStream) {
      throw new PluginError(PLUGIN_NAME, 'Streams are not supported!')
    }
  }

  function getFileContent (path) {
    let content

    try {
      content = fs.readFileSync(path, 'utf8')
    } catch (err) {
      content = ''
    }

    content = transformContent(content, path)

    return content
  }

  function transformContent (content, path) {
    var transformedContent = content

    if (typeof opts.transform === 'function') {
      transformedContent = opts.transform(content, path)
    }

    return transformedContent
  }

  return es.map(doInject)
};

module.exports = gulpInjectFile
