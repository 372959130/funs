define(['app','template','smExtend','footer'],function(app,template,smExtend,footer){
    var exportsObj = {};
    exportsObj.init = function(){
      app.setPageTitle("亲，欢迎来到广电生活服务平台");
      footer.init($('#lifeFooterBar'));//初始化页脚
      //初始化swiper
      $('.homeBanner>.swiper-container').swiper({
          pagination: '.swiper-pagination',
          paginationClickable: true,
          autoplay: 3000,
          autoplayDisableOnInteraction: false
      });
      //初始化swiper
      $('.homeBanner-vertical>.swiper-container').swiper({
          autoplay: 3600,//自动切换
          direction: 'vertical',//方向
          autoplayDisableOnInteraction: false,
          pagination: false
      });

      $.ajax({
        url: app.baseUrl+'/WECHAT/nomi/homePageCategories.do',
        type: 'POST',
        success: function(data, textStatus, xhr) {
          var data = app.toJson(data);
          if (data.success) {
            $('#meishi').attr('data-catid', data.result[0].cat_id);//一期写死-test
            $('#yule').attr('data-catid', data.result[1].cat_id);//一期写死-test
            $('#qita').attr('data-catid', data.result[2].cat_id);//一期写死-test
          }
        },
        complete : function(){
          //离线环境
          var data = {"errorCode":"0000","errorMsg":"","result":[{"cat_id":"326","cat_name":"美食","url":""},{"cat_id":"320","cat_name":"休闲娱乐","url":""},{"cat_id":"323","cat_name":"其他","url":""}],"success":true};
          data = app.toJson(data);
          if (data.success) {
            $('#meishi').attr('data-catid', data.result[0].cat_id);//一期写死-test
            $('#yule').attr('data-catid', data.result[1].cat_id);//一期写死-test
            $('#qita').attr('data-catid', data.result[2].cat_id);//一期写死-test
          }
        }
      });

      $.ajax({
        url: app.baseUrl+'/WECHAT/nomi/homePageShops.do',
        type: 'POST',
        success: function(data, textStatus, xhr) {
          if (typeof data == "string") {
            var data = JSON.parse(data);
          }
          if (data.success) {
            var shopListHtml = template('shopListTpl',data);
            $('.homeBanner-recommend').find('.swiper-wrapper').html( shopListHtml );
            $('.homeBanner-recommend>.swiper-container').swiper({
                paginationClickable: true,
                freeMode: true,
                slidesPerView: 4,
                pagination: false,
                loop:true
            });
            $.refreshScroller();//更新js滚动条
          }
        },
        complete : function(){
          //离线环境
          var data = {"errorCode":"0000","errorMsg":"","result":[{"shop_id":"5209872","shop_name":"爬儿爬儿火锅(西单华威店)","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C21%2C690%2C418%3Bw%3D230%3Bq%3D79/sign=8cbfcd98b651f819e56a590ae78466df/b3fb43166d224f4a950938a00ff790529922d1f5.jpg"},{"shop_id":"32134463","shop_name":"虾吃虾涮(西四店)","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C31%2C1000%2C605%3Bw%3D230%3Bq%3D80/sign=4a4ddb94be99a9012f7a017620a52648/91ef76c6a7efce1bc86bcf4aa951f3deb58f65e9.jpg"},{"shop_id":"5265221","shop_name":"邻家院子重庆火锅","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C720%2C436%3Bw%3D230%3Bq%3D99/sign=6121b4eb1fd8bc3ed2475c8abfbb8a2e/f31fbe096b63f62466c038d28144ebf81b4ca345.jpg"},{"shop_id":"10652563","shop_name":"辣莊(簋街店)","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C470%2C285%3Bw%3D230%3Bq%3D79/sign=11eb355bca11728b2462d662f5cceffe/2934349b033b5bb509019a3431d3d539b700bc22.jpg"},{"shop_id":"32125741","shop_name":"南小馆(西单大悦城店)","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C58%2C1136%2C687%3Bw%3D230%3Bq%3D79/sign=6a99836e998fa0ec6b883e4d1ba775db/37d12f2eb9389b50478ba10f8d35e5dde7116e72.jpg"},{"shop_id":"9263750","shop_name":"正锅老灶重庆老灶火锅(簋街二店)","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C720%2C436%3Bw%3D230%3Bq%3D80/sign=76af1cbb8018367ab9c6259d1343a7e4/bd3eb13533fa828b60e04c71fb1f4134960a5a65.jpg"}],"success":true};
          data = app.toJson(data);
          if (data.success) {
            var shopListHtml = template('shopListTpl',data);
            $('.homeBanner-recommend').find('.swiper-wrapper').html( shopListHtml );
            $('.homeBanner-recommend>.swiper-container').swiper({
                paginationClickable: true,
                freeMode: true,
                slidesPerView: 4,
                pagination: false,
                loop:true
            });
            $.refreshScroller();//更新js滚动条
          }
        }
      });

      $.refreshScroller();//更新js滚动条
    }

    //跳转
    $(document).off('click','#index .goodsItem').on('click','#index .goodsItem',function () {
        var goodid = $(this).data("goodid");
        $.router.load("../goodsDetail/goodsDetail.html?goodid="+goodid,true);// ignoreCache 是加载一个新页面时是否忽略缓存而发网络请求，默认是 false，表示使用缓存，可以设为 true 来忽略缓存
    });
    $(document).off('click','.linkToCategoryList').on('click','.linkToCategoryList',function () {
        var catid = $(this).attr('data-catid');
        var par = '?catid='+catid;
        $.router.load("../categoryList/categoryList.html"+par,true);
    });

    return exportsObj;
})
