define(['app','template','smExtend'],function(app,template,smExtend){
    var exportsObj = {};
    exportsObj.init = function(){
      app.setPageTitle("主页");
      //初始化swiper
      $('.homeBanner>.swiper-container').swiper({
          pagination: '.swiper-pagination',
          paginationClickable: true,
          autoplay: 30000,
          autoplayDisableOnInteraction: false
      });
      //初始化swiper
      $('.homeBanner-vertical>.swiper-container').swiper({
          autoplay: 36000,//自动切换
          direction: 'vertical',//方向
          autoplayDisableOnInteraction: false,
          pagination: false
      });

      $('.homeBanner-recommend>.swiper-container').swiper({
          paginationClickable: true,
          freeMode: true,
          slidesPerView: 4,
          pagination: false,
          loop:true
      });
      $.refreshScroller();//更新js滚动条
      isGeolocationAPIAvailable();
      requestPosition();
    }

    //跳转
    $(document).off('click','#index .goodsItem').on('click','#index .goodsItem',function () {
        var goodid = $(this).data("goodid");
        $.router.load("../goodsDetail/goodsDetail.html?goodid="+goodid,true);// ignoreCache 是加载一个新页面时是否忽略缓存而发网络请求，默认是 false，表示使用缓存，可以设为 true 来忽略缓存
    });


function isGeolocationAPIAvailable() { 
    var location = "No, Geolocation is not supported by this browser."; 
    if (window.navigator.geolocation) { 
        location = "Yes, Geolocation is supported by this browser."; 
    } 
    $.alert(location); 
} 


var nav = null;
function requestPosition() { 
    if (nav == null) { 
        nav = window.navigator; 
    } 
    if (nav != null) { 
        var geoloc = nav.geolocation; 
        if (geoloc != null) { 
            geoloc.getCurrentPosition(successCallback); 
        } 
        else { 
            $.alert("Geolocation API is not supported in your browser"); 
        } 
    } 
    else { 
        $.alert("Navigator is not found"); 
    } 
} 

function successCallback(position) { 
    $.alert(position.coords.latitude);
    $.alert(position.coords.longitude);
    console.log( position.coords.latitude ,  position.coords.longitude );
} 






    return exportsObj;
})
