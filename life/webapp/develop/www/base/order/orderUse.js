define(['app','template','smExtend','footer'],function(app,template,smExtend,footer){
    var exportsObj = {};
    var loading = false;// 加载flag
    var disableLoadingTipsFlag = false;//加载提示是否被禁止(控制只提示一次"已经没有更多内容了"的提示)
    var page = '';//默认第一页
    var page_size = '';//分页大小
    var maxPage = '';//最大分页数
    exportsObj.init = function(){
      app.setPageTitle("可使用订单");
      footer.init($('#lifeFooterBar'));//初始化页脚
      loading = false;// 加载flag
      disableLoadingTipsFlag = false;//加载提示是否被禁止(控制只提示一次"已经没有更多内容了"的提示)
      page = 1;//默认第一页
      page_size = 3;//分页大小
      maxPage = 99;//最大分页数
      getListData();
      $.refreshScroller();//更新js滚动条
    }
    //滚动刷新
    // 注册'infinite'事件处理函数
    $(document).off('infinite', '#orderUse #myRefresh').on('infinite', '#orderUse #myRefresh',function() {
          if (page==1) {return false};//第一页的时候,应该用js触发
          getListData();
    });
    function getListData(){
      if ( loading ) {return false};
      if ( page>maxPage ) {
        if (!disableLoadingTipsFlag) {
          disableLoadingTipsFlag = true;//禁用loading的提示
          // 删除加载提示符
          $('.infinite-scroll-preloader').hide();
        }
        return false;
      }
      $.ajax({
        url: app.url.getNoUseCoupons,
        type: 'POST',
        data: {
          // userId: 1,//test
          userId: app.getUserObj().USERID,
          page : page,
          page_size : page_size
        },
        beforeSend :function(){
          $.showIndicator();
          loading = true;
          //显示滚动刷新的加载提示符
          $('.infinite-scroll-preloader').show();
        },
        complete: function(xhr, textStatus) {
          $.hideIndicator();
          page++;//更新页码
          $.refreshScroller();//更新js滚动条
          // 重置加载flag
          loading = false;
          //显示滚动刷新的加载提示符
          $('.infinite-scroll-preloader').hide();

          var data = {"code":0,"data":{"gdshCoupons":{"total":4,"coupons":[{"tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1476519914&di=5aca06374c9faed154793f51c2c1e335&src=http://e.hiphotos.baidu.com/bainuo/crop=0,34,470,285;w=230;q=79/sign=579c731fd958ccbf0ff3ef7a24e8900d/50da81cb39dbb6fdb6243f8b0124ab18972b3724.jpg","rn":1,"shop_id":"2048003","status":0,"coupon_id":"453845441","coupon_code":"603333414283","order_id":"74031476843160825","good_id":"12f371c469c74c38b45a085cde8629c6","shop_name":"一日三餐","id":"3423e8f93068495b8662afdbf920d89f","good_name":"八月影像馆婚纱摄影","createtime":{"date":19,"day":3,"hours":10,"minutes":16,"month":9,"nanos":0,"seconds":39,"time":1476843399000,"timezoneOffset":-480,"year":116},"committime":"2016-10-19 10:12:38","good_price":10800,"market_price":13400,"description":"婚纱水下摄影1套，免费WiFi，需预约！","good_num":1,"user_id":"364FBF061F274D739E438F45D45CE3E6","partner_order_id":"1000108557","total_money":"10800.0"},{"tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1476519914&di=5aca06374c9faed154793f51c2c1e335&src=http://e.hiphotos.baidu.com/bainuo/crop=0,34,470,285;w=230;q=79/sign=579c731fd958ccbf0ff3ef7a24e8900d/50da81cb39dbb6fdb6243f8b0124ab18972b3724.jpg","rn":2,"shop_id":"2048003","status":0,"coupon_id":"453845447","coupon_code":"601782474194","order_id":"34941476844011904","good_id":"12f371c469c74c38b45a085cde8629c6","shop_name":"一日三餐","id":"e4fa0d039e8d4108989bb35c11b5ac49","good_name":"八月影像馆婚纱摄影","createtime":{"date":19,"day":3,"hours":10,"minutes":27,"month":9,"nanos":0,"seconds":43,"time":1476844063000,"timezoneOffset":-480,"year":116},"committime":"2016-10-19 10:26:49","good_price":10800,"market_price":13400,"description":"婚纱水下摄影1套，免费WiFi，需预约！","good_num":1,"user_id":"364FBF061F274D739E438F45D45CE3E6","partner_order_id":"1000108961","total_money":"10800.0"},{"tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1476519914&di=5aca06374c9faed154793f51c2c1e335&src=http://e.hiphotos.baidu.com/bainuo/crop=0,34,470,285;w=230;q=79/sign=579c731fd958ccbf0ff3ef7a24e8900d/50da81cb39dbb6fdb6243f8b0124ab18972b3724.jpg","rn":1,"shop_id":"2048003","status":0,"coupon_id":"453845441","coupon_code":"603333414283","order_id":"74031476843160825","good_id":"12f371c469c74c38b45a085cde8629c6","shop_name":"一日三餐","id":"3423e8f93068495b8662afdbf920d89f","good_name":"八月影像馆婚纱摄影","createtime":{"date":19,"day":3,"hours":10,"minutes":16,"month":9,"nanos":0,"seconds":39,"time":1476843399000,"timezoneOffset":-480,"year":116},"committime":"2016-10-19 10:12:38","good_price":10800,"market_price":13400,"description":"婚纱水下摄影1套，免费WiFi，需预约！","good_num":1,"user_id":"364FBF061F274D739E438F45D45CE3E6","partner_order_id":"1000108557","total_money":"10800.0"},{"tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1476519914&di=5aca06374c9faed154793f51c2c1e335&src=http://e.hiphotos.baidu.com/bainuo/crop=0,34,470,285;w=230;q=79/sign=579c731fd958ccbf0ff3ef7a24e8900d/50da81cb39dbb6fdb6243f8b0124ab18972b3724.jpg","rn":2,"shop_id":"2048003","status":0,"coupon_id":"453845447","coupon_code":"601782474194","order_id":"34941476844011904","good_id":"12f371c469c74c38b45a085cde8629c6","shop_name":"一日三餐","id":"e4fa0d039e8d4108989bb35c11b5ac49","good_name":"八月影像馆婚纱摄影","createtime":{"date":19,"day":3,"hours":10,"minutes":27,"month":9,"nanos":0,"seconds":43,"time":1476844063000,"timezoneOffset":-480,"year":116},"committime":"2016-10-19 10:26:49","good_price":10800,"market_price":13400,"description":"婚纱水下摄影1套，免费WiFi，需预约！","good_num":1,"user_id":"364FBF061F274D739E438F45D45CE3E6","partner_order_id":"1000108961","total_money":"10800.0"}]}},"message":"success","otherData":{}};
          data = app.toJson(data);
          console.log(data);
          if (data.code == 0) {
              var listData = data.data.gdshCoupons.coupons;
              maxPage = Math.ceil(data.data.gdshCoupons.total / page_size);//设置最大页码数
              if (listData.length==0) {
                $.toast("暂无您的订单信息");
                return false;
              }
            for(var i=0;i<listData.length;i++){
              listData[i].good_price_yuan = app.format_money(listData[i].good_price);//转化成元
              listData[i].market_price_yuan = app.format_money(listData[i].market_price);//转化成元
            }
            
            var orderListHtml = template('orderListTPL',listData);
            if (page==1) {
              $('#orderListBox').html(orderListHtml);
            }else{
              $('#orderListBox').append(orderListHtml);
            }
            $.refreshScroller();//更新js滚动条
          }
        },
        success : function(data){
          var data = app.toJson(data);
          console.log(data);
          if (data.code == 0) {
              var listData = data.data.gdshCoupons.coupons;
              maxPage = Math.ceil(data.data.gdshCoupons.total / page_size);//设置最大页码数
              if (listData.length==0) {
                $.toast("暂无您的订单信息");
                return false;
              }
            for(var i=0;i<listData.length;i++){
              listData[i].good_price_yuan = app.format_money(listData[i].good_price);//转化成元
              listData[i].market_price_yuan = app.format_money(listData[i].market_price);//转化成元
            }
            
            var orderListHtml = template('orderListTPL',listData);
            if (page==1) {
              $('#orderListBox').html(orderListHtml);
            }else{
              $('#orderListBox').append(orderListHtml);
            }
            $.refreshScroller();//更新js滚动条
          }
        }
        /*success: function(data) {
          var data = app.toJson(data);
          var listData = data.data;
          console.log(data);
          if (data.code == 0) {
              if (listData.jsonResult.length==0) {
                $.toast("暂无您的订单信息~");
              }
        	  for(var i=0;i<listData.jsonResult.length;i++){
        		  listData.jsonResult[i].current_price_yuan = app.format_money(listData.jsonResult[i].current_price);//转化成元
        		  listData.jsonResult[i].market_price_yuan = app.format_money(listData.jsonResult[i].market_price);//转化成元
        	  }
            var orderListHtml = template('orderListTPL',listData);
            $('#orderListBox').html(orderListHtml);
          }
        },*/
      });
    }

    return exportsObj;
})
