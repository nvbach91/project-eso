
const fs = require('fs');
const es = require('event-stream');
const argv = require('yargs').argv;
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserify = require('gulp-browserify');
const minify = require('gulp-clean-css');
const nodemon = require('gulp-nodemon');
const rename = require('gulp-rename');
const tap = require('gulp-tap');
const plumber = require('gulp-plumber');
const bs = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const obfuscate = require('gulp-javascript-obfuscator');

const scss = () => {
    return gulp.src([
        './src/scss/variables.scss',
        './src/scss/auth.scss',
        './src/scss/main.scss',
        './src/scss/tabs.scss',
        './src/scss/products.scss',
        './src/scss/cart.scss',
        './src/scss/mediaqueries.scss',
        './src/scss/admin.scss',
        './src/scss/registration.scss',
    ])
        .pipe(plumber())
        .pipe(concat('styles.scss'))
        .pipe(sass())
        .pipe(concat('styles.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(!argv.dev ? minify() : tap(() => {}))
        .pipe(gulp.dest('./public/css/'))
        .pipe(bs.stream());
};

const themes = () => {
    const themesSrcDir = './src/themes/';
    const pipes = fs.readdirSync(themesSrcDir).map((file) => {
        return gulp.src([`${themesSrcDir}${file}`])
            .pipe(plumber())
            .pipe(rename({suffix: '.min'}))
            .pipe(!argv.dev ? minify() : tap(() => {}))
            .pipe(gulp.dest('./public/css/'));
    });
    return es.merge(pipes).pipe(bs.stream());
};

const js = (prefix) => {
    return gulp.src(`./src/js/${prefix}/index.js`)
        .pipe(plumber())
        .pipe(browserify({
            insertGlobals: true,
            debug : argv.dev ? true : false
        }))
        .pipe(rename({basename: `${prefix}.build`, suffix: '.min', extname: '.js'}))
        .pipe(!argv.dev ? uglify() : tap(() => {}))
        //.pipe(!argv.dev ? obfuscate() : tap(() => {}))
        .pipe(gulp.dest('./public/js/'))
        .pipe(bs.reload({ stream: true }));
};

const kioskjs = () => js('kiosk');

const adminjs = () => js('admin');

const registrationjs = () => js('registration');

const browserSync = (cb) => {
    bs.init({
        proxy: 'https://eso.vcap.me:2000',
        https: {
            cert: './security/vcap-me-cert.pem',
            key: './security/vcap-me-key.pem',
        },
        files: [
            './public/js/**/*.js',
            './public/css/**/*.css'
        ],
        port: 9000,
        online: false,
        open: false,
        notify: false,
    });
    cb();
};

const pug = () => {
    return gulp.src('./views/*.pug')
        .pipe(bs.reload({ stream: true }));
};

const watch = (cb) => {
    gulp.watch('./src/scss/**/*.scss', scss);
    gulp.watch('./src/themes/**/*.css', themes);
    gulp.watch('./src/js/**/*.js', kioskjs);
    gulp.watch('./src/js/**/*.js', adminjs);
    gulp.watch('./src/js/**/*.js', registrationjs);
    gulp.watch('./views/**/*.pug', pug);
    cb();
};

const monitor = (cb) => {
    let started = false;
    nodemon({
        script: './bin/www',
        ignore: [
            'gulpfile.js', 
            'src/**/*.js', 
            'src/**/*.scss', 
            'public/**/*.js', 
            'public/**/*.css', 
        ]
    }).on('start', () => {
        if (!started) {
            cb();
            started = true;
        }
    });
};

exports.build = gulp.parallel(kioskjs, adminjs, registrationjs, themes, scss);
exports.default = gulp.parallel(kioskjs, adminjs, registrationjs, themes, scss, monitor, browserSync, watch);
