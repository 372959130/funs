/**
 * 业务逻辑:商品详情页,根据参数[goodId]查找对应商品的数据,所以把这个页面定义为"非缓存页面"(用路由跳转时ignoreCache:true)
 * "非缓存页面"对应的模块:需提供初始化函数[init]的接口,[init]函数能保证页面各组件或数据初始化成功 (在页面加载完毕后,会自动执行init函数)
 * "非缓存页面"对应的模块:绑定事件时,建议使用 $(selector).off('事件名A').on('事件名A',function(){}) 进行绑定(防止多次进入页面,重复绑定事件)
 * "非缓存页面"对应的模块:建议提供销毁函数[destroy]的接口,[destroy]函数可销毁组件实例,事件绑定等等 (在页面销毁前,会自动执行destroy函数)
 */
define(['smExtend','template','app'],function(smExtend,template,app){
      var exportsObj = {};
      var mySwiper = "";
      exportsObj.init = function(request){
        console.log("goodsDetail.js=>init");
        $.alert('切换页面时,每次会执行对应模块的init函数');
        app.setPageTitle("商品详情");
        $.ajax({
            url: '../../../json/goodlist.json',
            type: 'GET',
            success : function(data){
              if (typeof data == 'string') {
                data = JSON.parse(data);
              }
              for (var i = 0; i < data.list.length; i++) {
                  if ( data.list[i].goodId == request.goodid ) {
                      var html = template('swiper_TPL', data.list[i].imgDetail);
                      $('#goodsDetail').find('.swiper-wrapper').html(html);
                      //商品名称
                      $('#goodsName').html(data.list[i].goodName);
                  }
              }
              //初始化swiper
              mySwiper = $('#goodsDetail').find('.swiper-container').swiper({
                  pagination: '.swiper-pagination',
                  paginationClickable: true,
                  autoplay: 1000,
                  autoplayDisableOnInteraction: true
              });
            }
        })
      }
      exportsObj.destroy = function(){
        mySwiper.destroy();//销毁swiper实例
        console.log("goodsDetail.js=>destroy");
      }
      return exportsObj;
})
