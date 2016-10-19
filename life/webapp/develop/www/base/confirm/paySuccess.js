define(['app','template','smExtend','footer','linkTo'],function(app,template,smExtend,footer,linkTo){
    var exportsObj = {};
    var deal_id = '';//商品ID
    exportsObj.init = function(request){
      app.setPageTitle("支付结果");
      footer.init($('#lifeFooterBar'));//初始化页脚

     
      var num=0;
      function getCuopons(){
    	  $.ajax({
              url: app.url.getCoupons,
              type: 'POST',
              data: {
                orderId: request.orderId
              },
              success : function(data){
                var data = app.toJson(data);
                console.log( 'getCoupons' , data );
                if (data.retcode==0) {
                	if(data.coupon==undefined || data.coupon==null || data.coupon==""){
                		num++;
                		if(num>=5){
                			$('.carNum').html("券码获取超时，请到个人中心查看");
                			return;
                		}
                		$('.carNum').html("正在获取券码...");
                		setTimeout(getCuopons,5000);
                	}else{
                		$('.carNum').html( data.coupon );
                	}
                }
              }
          });
      }
      getCuopons();
      $.refreshScroller();//更新js滚动条
    }

    //跳转
    $(document).off('click','.toMy').on('click','.toMy',function () {
        linkTo.my();
    });

    //跳转
    $(document).off('click','.toHome').on('click','.toHome',function () {
        linkTo.index();
    });

    return exportsObj;
})
