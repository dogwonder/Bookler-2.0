const del = require('del');
const data = require('gulp-data');
const gulp = require('gulp');
const gulpnunjucks = require('gulp-nunjucks');
const merge = require('merge-stream');
const path = require('path');
const Prince = require("prince");
const markdown = require('nunjucks-markdown');
const marked = require('marked');
const nunjucks = require('nunjucks');
const util   = require("util");

// Variables
// -----------------
const dir = {
    dist: './dist/',
    src: './src/',
    styles: './src/styles/'
};

// Timestamp
const ts = Math.round((new Date()).getTime() / 1000);

 // Markdown vars
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(dir.src));
markdown.register(env, marked.parse);

//Nunjucks
gulp.task('nunjucks', () => {
    return gulp
      .src(path.join(dir.src, '/*.html'))
      //Get some data
      .pipe(data(function() {
        return require('./data/data.json')
      }))
      .pipe(gulpnunjucks.compile("", {env: env}))
      .pipe(gulp.dest(dir.dist))
});

//Prince XML
gulp.task('prince', () => {
    return Prince()
        .inputs(path.join(dir.dist, 'index.html'))
        .output(path.join(dir.dist, 'index-' + ts + '.pdf'))
        .execute()
        .then(function () {
            console.log('OK: done')
        }, function (error) {
            console.log('ERROR: ', util.inspect(error))
        })
});

// Cleaning
gulp.task('clean', () => del([ dir.dist ]) );

// Moving files
gulp.task('move-files', () => {  
    let css = gulp.src(path.join(dir.styles, 'print.css'))
      .pipe(gulp.dest(path.join(dir.dist)));
    let cover = gulp.src(path.join(dir.src, 'covers/frontcover.jpg'))
        .pipe(gulp.dest(path.join(dir.dist)));
      return merge(css, cover);
  });


// Init
// -----------------
exports.default = gulp.series('nunjucks');
exports.prod = gulp.series('clean', 'nunjucks', 'move-files', 'prince');