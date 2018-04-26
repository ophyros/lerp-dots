import gulp from 'gulp';
import watch from 'gulp-watch';
import postcss from 'gulp-postcss';
import pimport from "postcss-partial-import";
import pcssnext from "postcss-cssnext";
import pinline_svg from 'postcss-inline-svg';
import psvgo from 'postcss-svgo';
import pnested from 'postcss-nested';
import pcsso from 'postcss-csso';
import browserSync from "browser-sync";
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';

const path = {
	dist: {
		html: 'dist/',
        js: 'dist/js',
		css: 'dist/css/',
		img: 'dist/i/',
		fonts: 'dist/fonts/'
	},
	src: {
		html: 'src/*.html',
        js: 'src/js/main.js',
		style: 'src/css/styles.css',
		img: 'src/i/*.*',
		fonts: 'src/fonts/**/*'
	},
	watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/css/**/*.css',
		img: 'src/i/*.*',
		fonts: 'src/fonts/**/*'
	}
};

const bsConfig = {
    server: {
        baseDir: "./dist"
    },
    tunnel: false,
    port: 3000,
    logPrefix: 'browserSync',
    open: false
};

const reload = browserSync.reload;

gulp.task('html', () => {
	gulp.src(path.src.html)
		.pipe(gulp.dest(path.dist.html))
		.pipe(reload({stream: true}));
});

gulp.task('styles', () => {
	const processors = [
        pimport,
        pnested,
    	pcssnext({
          features: {
                calc: false,
                rem: false
              }
          }),
    	pinline_svg,
        psvgo,
        pcsso
    ];

	gulp.src(path.src.style)
		.pipe(postcss(processors))
		.pipe(gulp.dest(path.dist.css))
		.pipe(reload({stream: true}));
});

gulp.task('js', () => {
    browserify(path.src.js, {extensions: ['es6']})
        .transform("babelify", {presets: ["es2015"]})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(path.dist.js));
});

gulp.task('images', () => {
    gulp.src(path.src.img)
	  .pipe(gulp.dest(path.dist.img));
});

gulp.task('fonts', () => {
    gulp.src(path.src.fonts)
			.pipe(gulp.dest(path.dist.fonts));
});

gulp.task('build', [
	'html',
	'styles',
    'js',
	'images',
	'fonts'
]);

gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('watch', () => {
    watch([path.watch.html], (event, cb) => {
        gulp.start('html');
    });
    watch([path.watch.style], (event, cb) => {
        gulp.start('styles');
    });
		watch([path.watch.js], (event, cb) => {
        gulp.start('js');
        browserSync.reload();
    });

		watch([path.watch.img], (event, cb) => {
        gulp.start('images');
    });
		watch([path.watch.fonts], (event, cb) => {
        gulp.start('fonts');
    });
});

gulp.task('webserver', () => {
    browserSync(bsConfig);
});

gulp.task('default', ['build', 'webserver', 'watch']);
