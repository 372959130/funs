var gulp = require('gulp'),
	requirejsOptimize = require('gulp-requirejs-optimize'),//引入amd模块
	uglify = require('gulp-uglify'),//引入js压缩模块
	minifyCss = require('gulp-minify-css'),//引入css压缩模块
	autoprefixer = require('gulp-autoprefixer'),//补全浏览器前缀
	assetRev = require('gulp-asset-rev-edit'),//引入修改版本号模块
	del = require('del'),//删除文件/文件夹模块
	replace = require('gulp-replace');//引入替换模块

var ops = {
	dir : './build/',// 指定[输出目录]
	devDir : './develop/',// 指定[开发目录]
}

var AUTOPREFIXER_BROWSERS = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 2.3',
  'bb >= 10'
];

gulp.task('cleanFile',function(){//清空[输出目录]
	return del([ops.dir+'**/*']);
});

gulp.task('copyFile',['cleanFile'], function(){//复制文件到[输出目录]
	return gulp.src([
		ops.devDir+'**/*',
		//'!'+ops.devDir+'images/*'//不拷贝的路径,加 !
		])
		.pipe(gulp.dest(ops.dir));
});

gulp.task('buildCss',['copyFile'], function(){//压缩css
	return gulp.src(ops.dir+'/css/**/*.css')
		.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(minifyCss())
		.pipe(gulp.dest(ops.dir+'/css'));
});

//压缩、合并amdjs
gulp.task('rjs',['copyFile'], function () {
	return gulp.src(ops.dir+'/js/router.js')
		.pipe(requirejsOptimize({
			mainConfigFile: ops.dir+'/js/router.js',
		}))
		.pipe(gulp.dest(ops.dir+'/js/'));
});

gulp.task('buildJs',['rjs'], function(){//压缩js
	return gulp.src(ops.dir+'/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest(ops.dir));
});

gulp.task('urlReplace',['buildJs'], function(){//替换基础路径
	var txt = '/develop/www';
	var newTxt = '/build/www'
	return gulp.src(ops.dir+'/www/**/*.*')
		.pipe(replace(txt, newTxt))
		.pipe(gulp.dest(ops.dir+'/www/'));
});

gulp.task('rev',['buildJs'], function () {//添加版本号
	return gulp.src(ops.dir+'/www/**/*.html')
		// .pipe(replace(txt, ''))
		.pipe(assetRev())
		.pipe(gulp.dest(ops.dir+'/www'));
});

//===构建任务===//

gulp.task('default', ['cleanFile','copyFile','buildCss', 'rjs', 'buildJs','rev']);
