
const browserSync = require('browser-sync').create();
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

// Prince()
//     .inputs('index.html')
//     .output('index-' + ts + '.pdf')
//     .execute()
//     .then(function () {
//         console.log('OK: done')
//     }, function (error) {
//         console.log('ERROR: ', util.inspect(error))
//     })

 // Markdown vars
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(dir.src));
markdown.register(env, marked);
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
    // let readme = gulp.src(['README.md'])
    //   .pipe(gulp.dest(path.join(dir.src, 'markdown')));
    // let scripts = gulp.src(['assets/scripts/gallery.js', 'assets/vendor/js.cookie.js'])
    //   .pipe(gulp.dest(path.join(dir.dist, 'scripts')));
      return merge(css);
  });


// Static Server + watching scss/html files
gulp.task('serve', () => {

    browserSync.init({
      server: dir.dist
    });
  
});

// Init
// -----------------
const dev = gulp.series('nunjucks', 'serve');
const build = gulp.series('clean', 'nunjucks', 'move-files', 'prince');
exports.default = dev;
exports.build = build;