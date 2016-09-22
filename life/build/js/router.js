//---------requireJS配置---------//
require.config({
	paths : {
		//---通用---
		zepto : 'tool/zepto-1.2.0',
		sm : 'sui/js/sm',//sui的base库
		smConfig : 'fun/sm-config',//sui的配置 $.config
		app : 'fun/app',//通用工具类模块
		template : 'tool/artTemplate',//JS模板引擎
		//---非通用---
		smExtend : 'sui/js/sm-extend',//sui的extend库(配对样式表:sm-extend.min.css)
		smCityPicker : 'sui/js/sm-city-picker',//城市选择
	},
	shim : {
		sm : {
			deps:['zepto','smConfig']
		},
		smExtend : {
			deps:['zepto','smConfig','sm']
		},
		smCityPicker : {
			deps:['zepto','smConfig','sm']
		}
	}
});
//---------路由分发---------//
require(['zepto','sm','smExtend','app','template'], function($,sm,smExtend,app,template){
	$(function(){

	  var myRouter = {
	    thePageModule : '',//当前页面的模块(AMD规范模块,暴露出来的接口)
	  }
    //新页面中的组件初始化完毕
    $(window).on("pageInit", function(e, pageId, $page) {
        var request = app.getRequest();//获取url参数,组装为对象
        var path = window.location.pathname.substr(0,window.location.pathname.lastIndexOf('/')+1);
        //使用requireJS的require加载与[pageId]同名的[pageId.js](注意:*在sui的路由中,不会运行使用ajax载入页面里的js,所以配合requireJS使用)
        var pageModuleName = path + pageId +".js";
        console.info(pageModuleName);
        require([pageModuleName],function (pageModuleName) {
          myRouter.thePageModule = pageModuleName;
          try {
            //切换时需要重新刷新页面的模块,要在对应模块中暴露init函数用做初始化
            myRouter.thePageModule.init(request);
          } catch (e) {

          }
        });
    });
    //加载新的页面，动画切换完成后，移除旧的 document 前发送
    $(window).on('beforePageRemove', function(event,$pageContainer) {
          try {
            myRouter.thePageModule.destroy();
          } catch (e) {

          }
    });
    $.init();

    });
});
