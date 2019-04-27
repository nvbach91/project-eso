
const argv = require('yargs').argv;
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const minify = require('gulp-clean-css');
const nodemon = require('gulp-nodemon');
const rename = require('gulp-rename');
const tap = require('gulp-tap');
const plumber = require('gulp-plumber');
const bs = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const obfuscate = require('gulp-javascript-obfuscator');

const scss = () => {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(concat('styles.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(!argv.dev ? minify() : tap(() => {}))
        .pipe(gulp.dest('./public/css/'))
        .pipe(bs.stream());
};

const js = () => {
    return gulp.src(['./src/js/**/App.js', './src/js/**/!(App)*.js'])
        .pipe(plumber())
        .pipe(concat('build.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(!argv.dev ? uglify() : tap(() => {}))
        .pipe(!argv.dev ? obfuscate() : tap(() => {}))
        .pipe(gulp.dest('./public/js/'))
        .pipe(bs.reload({ stream: true }));
};

const browserSync = () => {
    bs.init({
        proxy: 'https://app.lvh.me:3000',
        https: {
            cert: './security/vcap-me-cert.pem',
            key: './security/vcap-me-key.pem',
        },
        files: [
            './public/js/**/*.js',
            './public/css/**/*.css'
        ],
        port: 7000,
        online: false,
        open: false,
    });
};

const pug = () => {
    return gulp.src('./views/*.pug')
        .pipe(bs.reload({ stream: true }));
};

const watch = () => {
    gulp.watch('./src/scss/**/*.scss', scss);
    gulp.watch('./src/js/**/*.js', js);
    gulp.watch('./views/**/*.pug', pug);
};

const monitor = (cb) => {
    var started = false;
    nodemon({
        script: './bin/www',
        ignore: [
            'gulpfile.js', 
            'src/**/*.js', 
            'src/**/*.scss', 
            'public/**/*.js', 
            'public/**/*.css', 
        ]
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    });
};

exports.build = gulp.parallel(js, scss);
exports.default = gulp.parallel(js, scss, monitor, browserSync, watch);