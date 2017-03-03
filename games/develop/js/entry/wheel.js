require([ 'jquery', 'loading' , 'FastClick','app','template','wheelRun','wheelPrizePostion_8'], function($, loading , FastClick,app,template,wheelRun,wheelPrizePostion){
	
	$(function(){
		FastClick.attach(document.body);//防止300ms点击延时

		app.imgLoad(app.hidePageLoading);
		var running = false;
		$('#btn').on('click', function(event) {
		        run();
		});
		function run (){
			if (!running) {
				//获取随机数,测试
	        			var index = parseInt(Math.random()*(7 - 0 + 0) + 0);
	        			running=true;
				wheelRun.run( index , function(){
					runEnd_callback(index);
				});
			}
		}
		function runEnd_callback(index){
			alert("指向的奖品index为:"+index);
			running=false;
		}

		$(document).on('click', '.closePopBtn', function(event) {
			$(this).parents('.pop').fadeOut(500);
		});

	});

});