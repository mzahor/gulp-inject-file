# gulp-inject-file [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> File inject plugin for [gulp](https://github.com/wearefractal/gulp). 

`gulp-inject-file` takes a stream of source files, and replaces inject pattern with contents of the referenced file. 

## Installation

Install `gulp-inject` as a development dependency:

```shell
npm install --save-dev gulp-inject-file
```

## Usage

**Project structure:**

```
└── src
    └── main.xml
        └── subitems
            └── child.xml
```


**The target file `src/main.xml`:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<one>
    <!-- inject: ./subitems/child.xml-->
</one>
```


**The child file `src/subitems/child.xml`:**

```xml
<child_record></child_record>
```


**The `gulpfile.js`:**

```javascript
var gulp = require('gulp');
var injectfile = require("gulp-inject-file");

gulp.task('inject', function () {
    return gulp.src('./src/main.xml')
                .pipe(injectfile({
                    // can use custom regex pattern here
                    // <filename> token will be replaced by filename regex pattern.
					// do not use capturing groups within your custom regex.
                    // this parameter is optional, default value: '<!--\\s*inject:<filename>-->'
                    pattern: '<!--\\s*inject:<filename>-->'
                }));
});
```

**`src/main.xml` after running `gulp inject`:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<one>
    <child_record></child_record>
</one>
```

The injected file paths are relative to each source file's `cwd`.


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-inject-file
[npm-image]: https://badge.fury.io/js/gulp-inject-file.svg

[travis-url]: http://travis-ci.org/mzahor/gulp-inject-file
[travis-image]: https://secure.travis-ci.org/mzahor/gulp-inject-file.svg?branch=master

[depstat-url]: https://david-dm.org/mzahor/gulp-inject-file
[depstat-image]: https://david-dm.org/mzahor/gulp-inject-file.svg
