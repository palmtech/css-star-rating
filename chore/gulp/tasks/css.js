/**
 * css.js
 *
 * This file uses the config.js and helper.js file located in ./gulp
 *
 * This file requires following npm modules:
 * ``
 * npm install gulp gulp-load-plugins gulp-autoprefixer gulp-sass gulp-cssnano gulp-rename gulp-inject  gulp-plumber --save-dev
 * ``
 *
 */

'use strict';

var gulp = require('gulp'),
    helper = require('../helper'),
    $ = require('gulp-load-plugins')(),
    //postcss = require('gulp-postcss'),
    autoprefixer = require('gulp-autoprefixer');

var config = require('../../chore.config.js'),
    assetsFolder = config.dist+'assets/',
    scssFoldername = 'scss/';


var defaultConfig = {
        indexFile : config.buildIndex,
        mainCssFile : 'star-rating.css',
        minCssFile : 'star-rating.min.css',
        sassScr : [config.dist +'/'+ scssFoldername+'star-rating.scss'],
        sassDest : config.dist+'/css/',
        sassOptions : {
            indentWidth: 4,
            outputStyle: 'expanded',
            errorLogToConsole: true
        },
        scssOrder : [],
        autoprefixerOptions : {
            browsers: [
                '> 1%',
                'last 2 versions',
                'firefox >= 4',
                'safari 7',
                'safari 8',
                'IE 8',
                'IE 9',
                'IE 10',
                'IE 11'
            ],
            cascade: false
        }
    };

//////////////////


var  cssConfig = defaultConfig;

/**
 *  Overrides
 *
 *  config.css {[see defaultConfig here]}
 *
 **/

if('css' in config) {
    cssConfig = helper.arrayConcatExtend(defaultConfig, config.css);
}

//__________________________________________________________________________________________________



//organize css files for project
gulp.task('css:clean', function(done) {
    helper.log('delete all autogenerated css files');
    return helper.clean([config.dist + '/scss/**/*.*', config.dist + '/css/**/*.*'], done);
});

gulp.task('css:copy',['css:clean'], function(done){
    helper.log('copy scss and css files');
    return gulp.src(['./src/**/*.scss', '!./src/sc5-styleguide/*'])
            .pipe(gulp.dest(config.dist), done);
});

gulp.task('css:recompile', function(done) {
    return compile(done);
});

gulp.task('css:compile', ['css:copy'], function(done) {
    return compile(done);
});

gulp.task('css:watch', function(done) {
    return gulp.watch(cssConfig.sassScr, ['css:recompile']);
});


gulp.task('css:compile-optimize',['css:compile'], function(done) {
  var srcFile = cssConfig.sassDest+cssConfig.mainCssFile;
  var destFile = cssConfig.sassDest+cssConfig.minCssFile;
  helper.log('minify css from '+srcFile+ ' and save it to '+destFile);

  return gulp.src(srcFile)
    .pipe($.cssnano())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(cssConfig.sassDest), done);

});


function compile(done) {
    helper.log('parsing scss from '+cssConfig.sassScr+', autoprefixe and save it to '+cssConfig.sassDest+cssConfig.mainCssFile);

    var processors = [
        autoprefixer(cssConfig.autoprefixerOptions)
    ];

    return gulp.src(cssConfig.sassScr)
        .pipe($.concat(cssConfig.mainCssFile))
        //move plumber into helper.js
        .pipe($.plumber()) // exit gracefully if something fails after this
        .pipe($.sass(cssConfig.sassOptions).on('error', $.sass.logError))
        .pipe(autoprefixer(cssConfig.autoprefixerOptions))
        .pipe(gulp.dest(cssConfig.sassDest), done);
}

