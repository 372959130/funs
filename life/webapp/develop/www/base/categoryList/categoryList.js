define(['app','template','smExtend','footer'],function(app,template,smExtend,footer){
    var exportsObj = {};
    var loading = false;// 加载flag
    var keyword = "";//搜索的关键字
    var page = 1;//默认第一页
    var page_size = 10;//分页大小
    var maxPage = 99;//最大分页数
    var cat_ids = "";
    var city_id = "";//城市id-北京--test
    exportsObj.init = function(request){
      app.setPageTitle("分类");
      cat_ids = request.catid;
      if (typeof request.keyword != 'undefined') {
        keyword = request.keyword;
      }
      city_id = 100010000;//城市id-北京--test

      footer.init($('#lifeFooterBar'));//初始化页脚

      //初始化swiper
      $('.homeBanner>.swiper-container').swiper({
          pagination: '.swiper-pagination',
          paginationClickable: true,
          autoplay: 30000,
          autoplayDisableOnInteraction: false
      });

      getShopData();
      getPickCity();
      

      $.refreshScroller();//更新js滚动条
    }

    //搜索
    $(document).off('submit', '#searchForm').on('submit', '#searchForm',function(event) {
        //提交表单后,才能触发 type=search 的软键盘中"搜索"按钮
        //把表单提交到iframe,实际上是要执行getShopData的异步请求
        keyword = $('#search').val();
        page=1;//重置
        maxPage=99;//重置
        getShopData();
        $('#search').blur();
    });

    //滚动刷新
    // 注册'infinite'事件处理函数
    $(document).off('infinite', '#categoryList #myRefresh').on('infinite', '#categoryList #myRefresh',function() {
          if (page==1) {return false};//第一页的时候,应该用js触发
          getShopData();
    });

    // 关闭
    $(document).off('click', '.closePopup').on('click', '.closePopup',function() {
          $.closeModal();//关闭popup
    });

    //地区选择
    $(document).off('click', '.citySelect').on('click', '.citySelect',function(event) {
      $.popup('.popup-city');
    });

    //选择城市
    $(document).off('click','.canSelet').on('click','.canSelet',function () {
        var city_id = $(this).attr("data-cityid");//城市id
        var cityname = $(this).html();//城市名称
        setCitySelectedName( cityname,city_id );
        /*选中后关闭popup并搜索*/
        $.closeModal();//关闭popup
        page=1;//重置
        maxPage=99;//重置
        disableLoadingTipsFlag = false;//重置
        getShopData();
    });

    function getPickCity(){
      var data = {"code":0,"data":{},"message":"success","otherData":{"cityjson":[{"city_id":"2800100000","cityname":"广州"},{"city_id":"2800100000","cityname":"广西"},{"city_id":"100010000","cityname":"北京"},{"city_id":"500010000","cityname":"天津"}]}};
      data = app.toJson(data);
      console.log("getPickCity",data);
      if (data.code==0) {
        cityData = data.otherData.cityjson;//赋值
        if (cityData.length==0) {
          $('.citySelect').hide();//如果没有城市数据,隐藏
          return false;
        }
        var cityListTplHtml = template('cityListTpl',cityData);
        $('#allCityList').html( cityListTplHtml );
        //nav头的当前选中城市与城市列表中的选择城市,默认选中第一个城市
        setCitySelectedName( cityData[0].cityname , cityData[0].city_id );
      }
    }

    function setCitySelectedName(cityname,city_id){
      $('.citySelected_name').html( cityname ).attr('data-cityid', city_id );
    }

    function getShopData(){
      if ( loading ) {return false};
      if ( page>maxPage ) {
        $.toast('没有更多商品咯~');
        // 删除加载提示符
        $('.infinite-scroll-preloader').hide();
        return false;
      }

      //商户检索
      $.ajax({
        url: app.baseUrl_commcenter + '/nomi/shopSearch.do',
        type: 'POST',
        data: {
            city_id: city_id,//城市id
            cat_ids: cat_ids,//分类id
            keyword : keyword,//搜索关键字
            page : page,
            page_size : page_size
        },
        beforeSend :function(){
          loading = true;
          //显示滚动刷新的加载提示符
          $('.infinite-scroll-preloader').show();
        },
        complete: function(xhr, textStatus) {
          //离线
          var data = {"errorCode":"200","errorMsg":"","result":{"errno":0,"msg":"success","data":{"total":500,"shops":[{"shop_id":5276463,"shop_name":"金茂万丽酒店燃餐厅","longitude":116.41672,"latitude":39.92748,"distance":-1,"deal_num":3,"shop_url":"https://www.nuomi.com/shop/5276463","shop_murl":"https://m.nuomi.com/merchant/5276463","per_price":"17000","average_score":4.35043,"address":"北京市东城区王府井大街57号(首都剧院(人艺剧场)对面)","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C21%2C690%2C418%3Bw%3D230%3Bq%3D99/sign=eb29b1eac15c1038303194828f21bf21/91ef76c6a7efce1b9f6f793aa851f3deb58f65fd.jpg","deals":[{"deal_id":4290992,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=ab531f42ab83dc2c8459c3044604f9f9&src=http://e.hiphotos.baidu.com/bainuo/crop=0,21,690,418;w=470;q=99/sign=c42594f85443fbf2d163fc638d4ee6b2/91ef76c6a7efce1b9f6f793aa851f3deb58f65fd.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=456a2472018e1e4c38df3e444f875ed7&src=http://e.hiphotos.baidu.com/bainuo/crop=0,21,690,418;w=230;q=99/sign=eb29b1eac15c1038303194828f21bf21/91ef76c6a7efce1b9f6f793aa851f3deb58f65fd.jpg","title":"金茂万丽酒店燃餐厅","min_title":"燃餐厅环球自助美食晚餐","description":"环球自助美食晚餐 ，免费WiFi，需预约！","market_price":35500,"current_price":17800,"promotion_price":17800,"sale_num":500,"score":4.51,"comment_num":43,"deal_url":"https://www.nuomi.com/deal/2u5vnpo9.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=2u5vnpo9"},{"deal_id":4290939,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=1859a390d18856d8432332ec3df0b062&src=http://e.hiphotos.baidu.com/bainuo/crop=0,16,690,418;w=470;q=80/sign=f68b436e5543fbf2d163fc638d4ee6b1/d4628535e5dde711a0382590a1efce1b9c1661e9.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=55a5a0b59c768d9a355c9384490f6dae&src=http://e.hiphotos.baidu.com/bainuo/crop=0,16,690,418;w=230;q=80/sign=d987667cc05c1038303194828f21bf22/d4628535e5dde711a0382590a1efce1b9c1661e9.jpg","title":"金茂万丽酒店燃餐厅","min_title":"燃餐厅工作日自助午餐","description":"单人午餐自助！店内提供免费WiFi，免费WiFi！","market_price":21800,"current_price":11800,"promotion_price":11800,"sale_num":865,"score":4.56,"comment_num":88,"deal_url":"https://www.nuomi.com/deal/sezakles.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=sezakles"},{"deal_id":10723118,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=762c4887c98a2bc1c2ed8941174432e5&src=http://e.hiphotos.baidu.com/bainuo/crop=0,21,690,418;w=470;q=99/sign=950cfafe6009c93d13bd54b7a20dd4ee/9f510fb30f2442a785284d55d643ad4bd113021f.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=28b3711712e4f288e34a153675b9c890&src=http://e.hiphotos.baidu.com/bainuo/crop=0,21,690,418;w=230;q=99/sign=8dd32246ce177f3e047ba64d4dff17f5/9f510fb30f2442a785284d55d643ad4bd113021f.jpg","title":"金茂万丽酒店燃餐厅","min_title":"燃餐厅环球自助美食晚餐","description":"环球自助美食晚餐！提供免费WiFi，免费WiFi！","market_price":35500,"current_price":13800,"promotion_price":13800,"sale_num":235,"score":3.55,"comment_num":20,"deal_url":"https://www.nuomi.com/deal/luricjcs.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=luricjcs"}]},{"shop_id":32134463,"shop_name":"虾吃虾涮(西四店)","longitude":116.38001,"latitude":39.931763,"distance":-1,"deal_num":3,"shop_url":"https://www.nuomi.com/shop/32134463","shop_murl":"https://m.nuomi.com/merchant/32134463","per_price":"8000","average_score":null,"address":"北京市西城区西四北大街236号","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C720%2C436%3Bw%3D230%3Bq%3D80/sign=78488e7a8526cffc7d65e5f2843166a0/48540923dd54564e5d551cdab4de9c82d1584f25.jpg","deals":[{"deal_id":13529859,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=39f172479fb589f2bcfe7c8ceb3c4cae&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=720;q=80/sign=24c97a9644a98226ac8e7167b7b29531/48540923dd54564e5d551cdab4de9c82d1584f25.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=5e4e8b9c88a46cef91e987d6fa6c5225&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=230;q=80/sign=78488e7a8526cffc7d65e5f2843166a0/48540923dd54564e5d551cdab4de9c82d1584f25.jpg","title":"虾吃虾涮","min_title":"虾吃虾涮双人餐","description":"双人餐！","market_price":17500,"current_price":12800,"promotion_price":12800,"sale_num":1537,"score":4.66,"comment_num":235,"deal_url":"https://www.nuomi.com/deal/skl0z8ue.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=skl0z8ue"},{"deal_id":13530153,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=42a5c46c9b3ed1fb2bfe76ba366908c0&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=720;q=79/sign=4e0ba38793eef01f595b4285ddceb515/f603918fa0ec08faabb909445eee3d6d54fbda9c.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=40bc5c06b6b1220fbd0e494d4a3c0479&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=230;q=79/sign=76d0bb3df71f3a294e878f8ea4159001/f603918fa0ec08faabb909445eee3d6d54fbda9c.jpg","title":"虾吃虾涮","min_title":"虾吃虾涮100元代金券","description":"100元代金券！","market_price":10000,"current_price":8800,"promotion_price":8800,"sale_num":1935,"score":4.75,"comment_num":189,"deal_url":"https://www.nuomi.com/deal/cuyiu4ao.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=cuyiu4ao"},{"deal_id":13530065,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=6b828543b4df13f588a5662e66ca5aaf&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=720;q=99/sign=b24dc7460d7b0208188665a15fe9dee3/a686c9177f3e67091576aa1c3cc79f3df9dc55db.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=5b9e32146f5a43be219f93e567990067&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=230;q=99/sign=c1ded0a805087bf469a30da9cfe37b1c/a686c9177f3e67091576aa1c3cc79f3df9dc55db.jpg","title":"虾吃虾涮","min_title":"虾吃虾涮4人餐","description":"4人餐！","market_price":30200,"current_price":24800,"promotion_price":24800,"sale_num":70,"score":4.23,"comment_num":13,"deal_url":"https://www.nuomi.com/deal/9mym9fxf.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=9mym9fxf"}]},{"shop_id":58324813,"shop_name":"蟹庄缘阳澄湖大闸蟹(平安里专卖店)","longitude":116.37586,"latitude":39.938206,"distance":-1,"deal_num":12,"shop_url":"https://www.nuomi.com/shop/58324813","shop_murl":"https://m.nuomi.com/merchant/58324813","per_price":"30200","average_score":null,"address":"北京市西城区平安里西大街8号（大道养生旁）","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C20%2C790%2C478%3Bw%3D230%3Bq%3D79/sign=30876c2e56df8db1a86126243413f166/c9fcc3cec3fdfc03fea28e0edc3f8794a5c226a9.jpg","deals":[{"deal_id":32790672,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=f6460ccf9e71d23efee91fdf6632ce5f&src=http://e.hiphotos.baidu.com/bainuo/crop=0,20,790,478;w=720;q=79/sign=25b351a5d554564ef12abe798eeeb0b0/c9fcc3cec3fdfc03fea28e0edc3f8794a5c226a9.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=dcfe78215e14a98a964c26b38a5be60b&src=http://e.hiphotos.baidu.com/bainuo/crop=0,20,790,478;w=230;q=79/sign=30876c2e56df8db1a86126243413f166/c9fcc3cec3fdfc03fea28e0edc3f8794a5c226a9.jpg","title":"蟹庄缘阳澄湖大闸蟹","min_title":"蟹庄缘大闸蟹888型礼券","description":"蟹庄缘阳澄湖大闸蟹888型礼券(8只装)1份！需预约！","market_price":88800,"current_price":29800,"promotion_price":29800,"sale_num":156,"score":5,"comment_num":1,"deal_url":"https://www.nuomi.com/deal/j00qdmg8u.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=j00qdmg8u"},{"deal_id":32493515,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=3f40d444334ad637480eb3da445da8a0&src=http://e.hiphotos.baidu.com/bainuo/crop=0,47,790,478;w=720;q=79/sign=078ab9813dfae6cd18fbf12132832310/8b82b9014a90f603e32cc4f13112b31bb151edec.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=ac578a0c8d301d1492ef5a8cca0b2233&src=http://e.hiphotos.baidu.com/bainuo/crop=0,47,790,478;w=230;q=79/sign=265c3fe0d8160924c86af85be93719ce/8b82b9014a90f603e32cc4f13112b31bb151edec.jpg","title":"蟹庄缘","min_title":"蟹庄缘大闸蟹5688型礼券","description":"蟹庄缘阳澄湖大闸蟹5688型礼券/礼盒1份，需预约！","market_price":568800,"current_price":229800,"promotion_price":229800,"sale_num":178,"score":0,"comment_num":0,"deal_url":"https://www.nuomi.com/deal/b00q72eia.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=b00q72eia"},{"deal_id":32541543,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=d682eeb3e720401d7ed4c305fd5cf46d&src=http://e.hiphotos.baidu.com/bainuo/crop=0,20,790,478;w=720;q=79/sign=785c1594c0fcc3cea08f9373af75faba/5bafa40f4bfbfbed9428afc970f0f736afc31f16.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=adb95d36148e8fc6dccde799c5b05842&src=http://e.hiphotos.baidu.com/bainuo/crop=0,20,790,478;w=230;q=79/sign=c7907d86b2a1cd1111f928608422e4ce/5bafa40f4bfbfbed9428afc970f0f736afc31f16.jpg","title":"蟹庄缘阳澄湖大闸蟹","min_title":"蟹庄缘大闸蟹1888型礼券","description":"阳澄湖大闸蟹1888型礼券(10只装)1份！需预约！","market_price":188800,"current_price":59800,"promotion_price":59800,"sale_num":157,"score":0,"comment_num":0,"deal_url":"https://www.nuomi.com/deal/s00q7q7id.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=s00q7q7id"},{"deal_id":32537752,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=880c6223d9d7eafb103994fab7762792&src=http://e.hiphotos.baidu.com/bainuo/crop=0,7,850,514;w=720;q=80/sign=e91845641fd8bc3ed2475c8abfbb8a29/500fd9f9d72a6059a0b411442e34349b023bbacc.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=728e41b065270a1c0bbb48b4a2868e9b&src=http://e.hiphotos.baidu.com/bainuo/crop=0,7,850,514;w=230;q=80/sign=0593dcb6ba3eb1355088edfb9b2e84e4/500fd9f9d72a6059a0b411442e34349b023bbacc.jpg","title":"蟹庄缘阳澄湖大闸蟹","min_title":"蟹庄缘大闸蟹5288型礼券","description":"蟹庄缘阳澄湖大闸蟹5288型礼券/礼盒1份！需预约！","market_price":528800,"current_price":189800,"promotion_price":189800,"sale_num":56,"score":0,"comment_num":0,"deal_url":"https://www.nuomi.com/deal/a00q7nj2w.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=a00q7nj2w"},{"deal_id":32539321,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=307e4a4015a1896cf526d0d74434a645&src=http://e.hiphotos.baidu.com/bainuo/crop=0,20,790,478;w=720;q=79/sign=d54099c970f0f736ccb1164137659f2b/a8014c086e061d95745f988e73f40ad162d9ca6f.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=e00d68834d22358e71b9c8fa17e94a17&src=http://e.hiphotos.baidu.com/bainuo/crop=0,20,790,478;w=230;q=79/sign=fc26c029ac0f4bfb989fc4143e7f54c2/a8014c086e061d95745f988e73f40ad162d9ca6f.jpg","title":"蟹庄缘阳澄湖大闸蟹","min_title":"蟹庄缘大闸蟹3288型礼券","description":"阳澄湖大闸蟹3288型礼券(8只装)1份！需预约！","market_price":328800,"current_price":99800,"promotion_price":99800,"sale_num":88,"score":0,"comment_num":0,"deal_url":"https://www.nuomi.com/deal/v00q85wll.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=v00q85wll"},{"deal_id":32541888,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=880c6223d9d7eafb103994fab7762792&src=http://e.hiphotos.baidu.com/bainuo/crop=0,7,850,514;w=720;q=80/sign=e91845641fd8bc3ed2475c8abfbb8a29/500fd9f9d72a6059a0b411442e34349b023bbacc.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=728e41b065270a1c0bbb48b4a2868e9b&src=http://e.hiphotos.baidu.com/bainuo/crop=0,7,850,514;w=230;q=80/sign=0593dcb6ba3eb1355088edfb9b2e84e4/500fd9f9d72a6059a0b411442e34349b023bbacc.jpg","title":"蟹庄缘阳澄湖大闸蟹","min_title":"蟹庄缘大闸蟹1688型礼券","description":"阳澄湖大闸蟹1688型礼券(8只装)1份！需预约！","market_price":168800,"current_price":49800,"promotion_price":49800,"sale_num":96,"score":0,"comment_num":0,"deal_url":"https://www.nuomi.com/deal/f00q86ccj.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=f00q86ccj"},{"deal_id":32791522,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=f6460ccf9e71d23efee91fdf6632ce5f&src=http://e.hiphotos.baidu.com/bainuo/crop=0,20,790,478;w=720;q=79/sign=25b351a5d554564ef12abe798eeeb0b0/c9fcc3cec3fdfc03fea28e0edc3f8794a5c226a9.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=dcfe78215e14a98a964c26b38a5be60b&src=http://e.hiphotos.baidu.com/bainuo/crop=0,20,790,478;w=230;q=79/sign=30876c2e56df8db1a86126243413f166/c9fcc3cec3fdfc03fea28e0edc3f8794a5c226a9.jpg","title":"蟹庄缘阳澄湖大闸蟹","min_title":"蟹庄缘大闸蟹988型礼券","description":"蟹庄缘阳澄湖大闸蟹988型礼券/礼盒(10只装)1份！需预约！","market_price":98800,"current_price":39800,"promotion_price":39800,"sale_num":59,"score":4.5,"comment_num":2,"deal_url":"https://www.nuomi.com/deal/q00qdktac.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=q00qdktac"},{"deal_id":32538386,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=880c6223d9d7eafb103994fab7762792&src=http://e.hiphotos.baidu.com/bainuo/crop=0,7,850,514;w=720;q=80/sign=e91845641fd8bc3ed2475c8abfbb8a29/500fd9f9d72a6059a0b411442e34349b023bbacc.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=728e41b065270a1c0bbb48b4a2868e9b&src=http://e.hiphotos.baidu.com/bainuo/crop=0,7,850,514;w=230;q=80/sign=0593dcb6ba3eb1355088edfb9b2e84e4/500fd9f9d72a6059a0b411442e34349b023bbacc.jpg","title":"蟹庄缘阳澄湖大闸蟹","min_title":"蟹庄缘大闸蟹4288型礼券","description":"蟹庄缘大闸蟹4288型礼券(8只装)1份！需预约！","market_price":428800,"current_price":139800,"promotion_price":139800,"sale_num":13,"score":5,"comment_num":1,"deal_url":"https://www.nuomi.com/deal/o00q7t1ls.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=o00q7t1ls"},{"deal_id":32538108,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=03435fb28b688b9c5fb4465fd056013c&src=http://e.hiphotos.baidu.com/bainuo/crop=0,20,790,478;w=720;q=79/sign=5c15e66b26738bd4d06ee8719cbbabe4/42166d224f4a20a4c082a57198529822730ed0ec.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=49a3aabd79c8b2abf20eea958684f907&src=http://e.hiphotos.baidu.com/bainuo/crop=0,20,790,478;w=230;q=79/sign=35ba1cd7f01986185508b5c477dd0241/42166d224f4a20a4c082a57198529822730ed0ec.jpg","title":"蟹庄缘阳澄湖大闸蟹","min_title":"蟹庄缘阳澄湖4688型礼券","description":"阳澄湖大闸蟹礼盒10只装1份！需预约！","market_price":468800,"current_price":179800,"promotion_price":179800,"sale_num":5,"score":0,"comment_num":0,"deal_url":"https://www.nuomi.com/deal/q00q837ub.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=q00q837ub"},{"deal_id":32538879,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=880c6223d9d7eafb103994fab7762792&src=http://e.hiphotos.baidu.com/bainuo/crop=0,7,850,514;w=720;q=80/sign=e91845641fd8bc3ed2475c8abfbb8a29/500fd9f9d72a6059a0b411442e34349b023bbacc.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=728e41b065270a1c0bbb48b4a2868e9b&src=http://e.hiphotos.baidu.com/bainuo/crop=0,7,850,514;w=230;q=80/sign=0593dcb6ba3eb1355088edfb9b2e84e4/500fd9f9d72a6059a0b411442e34349b023bbacc.jpg","title":"蟹庄缘阳澄湖大闸蟹","min_title":"蟹庄缘大闸蟹3688型礼券","description":"阳澄湖大闸蟹3688型礼券(10只装)1份！需预约！","market_price":368800,"current_price":129800,"promotion_price":129800,"sale_num":22,"score":0,"comment_num":0,"deal_url":"https://www.nuomi.com/deal/900q8e4cf.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=900q8e4cf"},{"deal_id":32539396,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=880c6223d9d7eafb103994fab7762792&src=http://e.hiphotos.baidu.com/bainuo/crop=0,7,850,514;w=720;q=80/sign=e91845641fd8bc3ed2475c8abfbb8a29/500fd9f9d72a6059a0b411442e34349b023bbacc.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=728e41b065270a1c0bbb48b4a2868e9b&src=http://e.hiphotos.baidu.com/bainuo/crop=0,7,850,514;w=230;q=80/sign=0593dcb6ba3eb1355088edfb9b2e84e4/500fd9f9d72a6059a0b411442e34349b023bbacc.jpg","title":"蟹庄缘阳澄湖大闸蟹","min_title":"蟹庄缘大闸蟹2688型礼券","description":"阳澄湖大闸蟹2688型礼券(10只装)1份！需预约！","market_price":268800,"current_price":89800,"promotion_price":89800,"sale_num":42,"score":0,"comment_num":0,"deal_url":"https://www.nuomi.com/deal/z00q8jmuv.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=z00q8jmuv"},{"deal_id":32541000,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=880c6223d9d7eafb103994fab7762792&src=http://e.hiphotos.baidu.com/bainuo/crop=0,7,850,514;w=720;q=80/sign=e91845641fd8bc3ed2475c8abfbb8a29/500fd9f9d72a6059a0b411442e34349b023bbacc.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=728e41b065270a1c0bbb48b4a2868e9b&src=http://e.hiphotos.baidu.com/bainuo/crop=0,7,850,514;w=230;q=80/sign=0593dcb6ba3eb1355088edfb9b2e84e4/500fd9f9d72a6059a0b411442e34349b023bbacc.jpg","title":"蟹庄缘阳澄湖大闸蟹","min_title":"蟹庄缘大闸蟹2288型礼券","description":"阳澄湖大闸蟹2288型礼券(8只装)1份！需预约！","market_price":228800,"current_price":69800,"promotion_price":69800,"sale_num":32,"score":0,"comment_num":0,"deal_url":"https://www.nuomi.com/deal/700q8gn2a.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=700q8gn2a"}]},{"shop_id":5105024,"shop_name":"海塘海鲜自助火锅","longitude":116.44512,"latitude":39.936596,"distance":-1,"deal_num":2,"shop_url":"https://www.nuomi.com/shop/5105024","shop_murl":"https://m.nuomi.com/merchant/5105024","per_price":"18300","average_score":4.76332,"address":"北京市朝阳区工体北路新中西街8号亚洲大酒店附近(王家园胡同16号)","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C720%2C436%3Bw%3D230%3Bq%3D99/sign=af4655a3ccef76092844c3df13ed8ffc/f9198618367adab4e95f4a7d8cd4b31c8701e405.jpg","deals":[{"deal_id":7940638,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=26ebed5e4a365855ce6ea6b88034c191&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=720;q=99/sign=731068fa36adcbef157b2446919f02ed/f9198618367adab4e95f4a7d8cd4b31c8701e405.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=9c8f5a510afe340e31fceecdc58e0943&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=230;q=99/sign=af4655a3ccef76092844c3df13ed8ffc/f9198618367adab4e95f4a7d8cd4b31c8701e405.jpg","title":"海塘海鲜自助火锅","min_title":"海塘单人自助晚餐","description":"单人自助晚餐！节假日通用！提供免费停车位，免费停车！","market_price":25800,"current_price":18800,"promotion_price":18800,"sale_num":9821,"score":4.72,"comment_num":724,"deal_url":"https://www.nuomi.com/deal/h2in3ywd.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=h2in3ywd"},{"deal_id":31935907,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=26ebed5e4a365855ce6ea6b88034c191&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=720;q=99/sign=731068fa36adcbef157b2446919f02ed/f9198618367adab4e95f4a7d8cd4b31c8701e405.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=9c8f5a510afe340e31fceecdc58e0943&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=230;q=99/sign=af4655a3ccef76092844c3df13ed8ffc/f9198618367adab4e95f4a7d8cd4b31c8701e405.jpg","title":"海塘海鲜自助火锅","min_title":"海塘单人儿童自助餐","description":"单人儿童自助晚餐1人！免费停车！","market_price":25800,"current_price":9400,"promotion_price":9400,"sale_num":51,"score":5,"comment_num":2,"deal_url":"https://www.nuomi.com/deal/s00pv30ea.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=s00pv30ea"}]},{"shop_id":10652563,"shop_name":"辣莊(簋街店)","longitude":116.42796,"latitude":39.947273,"distance":-1,"deal_num":5,"shop_url":"https://www.nuomi.com/shop/10652563","shop_murl":"https://m.nuomi.com/merchant/10652563","per_price":"11400","average_score":4.77937,"address":"北京市东城区东直门内大街199-201号","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C470%2C285%3Bw%3D230%3Bq%3D79/sign=11eb355bca11728b2462d662f5cceffe/2934349b033b5bb509019a3431d3d539b700bc22.jpg","deals":[{"deal_id":10657143,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=51a44adad0a168379df84e7440a5457c&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,285;w=470;q=79/sign=87fb36e8cffcc3cea08f9373af75fab8/2934349b033b5bb509019a3431d3d539b700bc22.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=dc9548ca1845d481dc4eb86583f4778b&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,285;w=230;q=79/sign=11eb355bca11728b2462d662f5cceffe/2934349b033b5bb509019a3431d3d539b700bc22.jpg","title":"辣莊","min_title":"辣莊100元代金券","description":"100元代金券！免费WiFi！","market_price":10000,"current_price":7500,"promotion_price":7500,"sale_num":1738,"score":4.84,"comment_num":158,"deal_url":"https://www.nuomi.com/deal/a4uxdrpi.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=a4uxdrpi"},{"deal_id":8506067,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=51a44adad0a168379df84e7440a5457c&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,285;w=470;q=79/sign=87fb36e8cffcc3cea08f9373af75fab8/2934349b033b5bb509019a3431d3d539b700bc22.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=dc9548ca1845d481dc4eb86583f4778b&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,285;w=230;q=79/sign=11eb355bca11728b2462d662f5cceffe/2934349b033b5bb509019a3431d3d539b700bc22.jpg","title":"辣莊重庆老火锅","min_title":"辣莊老火锅100元代金券","description":"100元代金券！免费WiFi！","market_price":10000,"current_price":8800,"promotion_price":8800,"sale_num":5227,"score":4.71,"comment_num":476,"deal_url":"https://www.nuomi.com/deal/opdfwzhq.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=opdfwzhq"},{"deal_id":31409547,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=51a44adad0a168379df84e7440a5457c&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,285;w=470;q=79/sign=87fb36e8cffcc3cea08f9373af75fab8/2934349b033b5bb509019a3431d3d539b700bc22.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=dc9548ca1845d481dc4eb86583f4778b&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,285;w=230;q=79/sign=11eb355bca11728b2462d662f5cceffe/2934349b033b5bb509019a3431d3d539b700bc22.jpg","title":"辣莊重庆老火锅","min_title":"辣莊火锅2至3人餐","description":"332元辣莊火锅2至3人餐！免费WiFi！","market_price":33200,"current_price":26900,"promotion_price":26900,"sale_num":109,"score":4.94,"comment_num":16,"deal_url":"https://www.nuomi.com/deal/r00pjyzpb.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=r00pjyzpb"},{"deal_id":34203513,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=51a44adad0a168379df84e7440a5457c&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,285;w=470;q=79/sign=87fb36e8cffcc3cea08f9373af75fab8/2934349b033b5bb509019a3431d3d539b700bc22.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=dc9548ca1845d481dc4eb86583f4778b&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,285;w=230;q=79/sign=11eb355bca11728b2462d662f5cceffe/2934349b033b5bb509019a3431d3d539b700bc22.jpg","title":"辣莊","min_title":"辣莊100元代金券","description":"100元代金券！免费WiFi！","market_price":10000,"current_price":7700,"promotion_price":7700,"sale_num":16,"score":0,"comment_num":0,"deal_url":"https://www.nuomi.com/deal/g00r6oj6n.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=g00r6oj6n"},{"deal_id":34203546,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=51a44adad0a168379df84e7440a5457c&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,285;w=470;q=79/sign=87fb36e8cffcc3cea08f9373af75fab8/2934349b033b5bb509019a3431d3d539b700bc22.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=dc9548ca1845d481dc4eb86583f4778b&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,285;w=230;q=79/sign=11eb355bca11728b2462d662f5cceffe/2934349b033b5bb509019a3431d3d539b700bc22.jpg","title":"辣莊","min_title":"辣莊100元代金券","description":"100元代金券！免费WiFi！","market_price":10000,"current_price":8500,"promotion_price":8500,"sale_num":6,"score":0,"comment_num":0,"deal_url":"https://www.nuomi.com/deal/p00r7uzha.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=p00r7uzha"}]},{"shop_id":5118339,"shop_name":"翠明庄宾馆西餐厅","longitude":116.41256,"latitude":39.921318,"distance":-1,"deal_num":1,"shop_url":"https://www.nuomi.com/shop/5118339","shop_murl":"https://m.nuomi.com/merchant/5118339","per_price":"7000","average_score":null,"address":"北京市东城区南河沿大街1号翠明庄宾馆内(近皇城根遗址公园)","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C24%2C800%2C484%3Bw%3D230%3Bq%3D99/sign=87e4b030b112c8fca0bcac8dc133be77/a50f4bfbfbedab64f6208fd0ff36afc379311e54.jpg","deals":[{"deal_id":11888400,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=c4e42729d4a807f0fdc0c2b440df4bbb&src=http://e.hiphotos.baidu.com/bainuo/crop=0,24,800,484;w=720;q=99/sign=36920b239a45d688b74de8e499f2512c/a50f4bfbfbedab64f6208fd0ff36afc379311e54.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=950135377119909104887140b0a650c0&src=http://e.hiphotos.baidu.com/bainuo/crop=0,24,800,484;w=230;q=99/sign=87e4b030b112c8fca0bcac8dc133be77/a50f4bfbfbedab64f6208fd0ff36afc379311e54.jpg","title":"翠明庄宾馆","min_title":"翠明庄宾馆88元自助午餐","description":"单人自助午餐！请提前1天预约！免费停车位，免费WiFi，免费停车，免费WiFi，需预约！","market_price":15900,"current_price":8800,"promotion_price":8800,"sale_num":94,"score":4,"comment_num":9,"deal_url":"https://www.nuomi.com/deal/wgak6wqf.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=wgak6wqf"}]},{"shop_id":5308127,"shop_name":"歌华开元大酒店江南中餐厅","longitude":116.40031,"latitude":39.97138,"distance":-1,"deal_num":4,"shop_url":"https://www.nuomi.com/shop/5308127","shop_murl":"https://m.nuomi.com/merchant/5308127","per_price":"13800","average_score":4.53846,"address":"北京市朝阳区鼓楼外大街19号歌华开元大酒店1楼(安华桥南)","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C8%2C800%2C484%3Bw%3D230%3Bq%3D79/sign=0de3ac55740e0cf3b4b814bb3776de27/0ff41bd5ad6eddc4cc6bb5bc3fdbb6fd536633ec.jpg","deals":[{"deal_id":5451805,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=1d82f5644a706082f9c8d4e9edef14d9&src=http://e.hiphotos.baidu.com/bainuo/crop=0,8,800,484;w=720;q=79/sign=9446a4259e22720e6f81b8ba46fb267e/0ff41bd5ad6eddc4cc6bb5bc3fdbb6fd536633ec.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=0bbeb7781f1727aef2b0f1d8824cde39&src=http://e.hiphotos.baidu.com/bainuo/crop=0,8,800,484;w=230;q=79/sign=0de3ac55740e0cf3b4b814bb3776de27/0ff41bd5ad6eddc4cc6bb5bc3fdbb6fd536633ec.jpg","title":"北京歌华开元大酒店","min_title":"北京歌华家宴12人套餐","description":"家宴12人套餐！ 提供免费停车位、WiFi，可使用包间，免费停车，免费WiFi！","market_price":223800,"current_price":152000,"promotion_price":152000,"sale_num":28,"score":4,"comment_num":2,"deal_url":"https://www.nuomi.com/deal/owycfbvn.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=owycfbvn"},{"deal_id":5050721,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=2bb37825caa215ba7bca0735f6eb95e8&src=http://e.hiphotos.baidu.com/bainuo/crop=0,8,800,484;w=720;q=80/sign=6516fa6acefcc3cea08f9373af75fab0/64380cd7912397dd8342ee4c5f82b2b7d0a287ba.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=4427aa9b2d83d7f62ebc7445c5424f7a&src=http://e.hiphotos.baidu.com/bainuo/crop=0,8,800,484;w=230;q=80/sign=9b148b84c5cec3fd9f71fd35ebb8f807/64380cd7912397dd8342ee4c5f82b2b7d0a287ba.jpg","title":"歌华开元大酒店江南华庭中餐","min_title":"歌华开元大酒店家宴","description":"家宴9人餐！节假日通用，需提前1天预约，提供免费WiFi，可使用包间，免费停车，免费WiFi！","market_price":164700,"current_price":108000,"promotion_price":108000,"sale_num":11,"score":5,"comment_num":2,"deal_url":"https://www.nuomi.com/deal/u6kj3bf6.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=u6kj3bf6"},{"deal_id":5050584,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=474a4b03b98d3486190fa0c2a5b1af23&src=http://e.hiphotos.baidu.com/bainuo/crop=9,14,780,473;w=470;q=89/sign=67cf02e05fee3d6d3689dd8b7e2f4113/3b87e950352ac65c26ca7734fdf2b21192138aad.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=a35de16390411bde1f88c85cbfce8916&src=http://e.hiphotos.baidu.com/bainuo/crop=9,14,780,473;w=230;q=79/sign=a77d849b0efa513d45e5369e005479ca/3b87e950352ac65c26ca7734fdf2b21192138aad.jpg","title":"歌华开元大酒店江南中餐","min_title":"歌华开元大酒店家宴","description":"家宴6人餐！节假日通用，请提前1天预约，提供免费WiFi、停车位，免费停车，免费WiFi，需预约！","market_price":90600,"current_price":56800,"promotion_price":56800,"sale_num":22,"score":4,"comment_num":2,"deal_url":"https://www.nuomi.com/deal/gvkennx0.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=gvkennx0"},{"deal_id":5050312,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=72829eb94fd02dbe5d4fbe6aeed749b7&src=http://e.hiphotos.baidu.com/bainuo/crop=0,133,600,363;w=470;q=79/sign=5cfe0a5ed443ad4bb2611c80bf32769e/0d338744ebf81a4cd4c21b32d22a6059242da65d.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=9ccc37f91ac1539ba1eef63ab7af775e&src=http://e.hiphotos.baidu.com/bainuo/crop=0,133,600,363;w=230;q=79/sign=1b9ccd780a2442a7ba41a7e5ec73817a/0d338744ebf81a4cd4c21b32d22a6059242da65d.jpg","title":"歌华开元大酒店","min_title":"歌华开元3人餐","description":"歌华开元大酒店家宴3人餐！节假日通用，提供免费WiFi、停车位，提前1天预约，免费停车，免费WiFi，需预约！","market_price":45700,"current_price":26800,"promotion_price":26800,"sale_num":36,"score":4,"comment_num":7,"deal_url":"https://www.nuomi.com/deal/ltx0shei.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=ltx0shei"}]},{"shop_id":7799611,"shop_name":"花家怡园(东直门店)","longitude":116.43548,"latitude":39.94731,"distance":-1,"deal_num":4,"shop_url":"https://www.nuomi.com/shop/7799611","shop_murl":"https://m.nuomi.com/merchant/7799611","per_price":"3400","average_score":4.30303,"address":"北京市东城区东直门内大街5号(地铁2号线东直门站西北口出向西400米)","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C720%2C436%3Bw%3D230%3Bq%3D99/sign=813a89ee1a950a7b617a148437e14ee9/94cad1c8a786c917b20c80e1ce3d70cf3ac757df.jpg","deals":[{"deal_id":30202359,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=fa4273e611643138011230fe2a51877c&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=720;q=99/sign=6433abe069061d9569096d7846c426e1/94cad1c8a786c917b20c80e1ce3d70cf3ac757df.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=b74c1ef2daf74cb2589eab19df9f376a&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=230;q=99/sign=813a89ee1a950a7b617a148437e14ee9/94cad1c8a786c917b20c80e1ce3d70cf3ac757df.jpg","title":"花家怡园","min_title":"花家怡园4人餐","description":"4人餐！免费停车，免费WiFi！","market_price":77800,"current_price":29800,"promotion_price":29800,"sale_num":93,"score":4.18,"comment_num":11,"deal_url":"https://www.nuomi.com/deal/t00m0ulbu.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=t00m0ulbu"},{"deal_id":30202306,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=efe1c307fad3ac723f465ad0936d4357&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=720;q=80/sign=8d62c69b8cd4b31ce473cefbbae60b4f/fc1f4134970a304ee2907d22d6c8a786c8175cbc.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=6970c6a4b832b6aa013a3ac260851916&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=230;q=80/sign=e9fc633cb41c8701c2f9e8a61a4fb21f/fc1f4134970a304ee2907d22d6c8a786c8175cbc.jpg","title":"花家怡园","min_title":"花家东直门2人自选套餐","description":"双人餐！免费停车，免费WiFi！","market_price":40600,"current_price":16800,"promotion_price":16800,"sale_num":68,"score":5,"comment_num":8,"deal_url":"https://www.nuomi.com/deal/v00m0wo5t.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=v00m0wo5t"},{"deal_id":30202448,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=1652d4a8b42892a650b0ef8d973c1ca0&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=720;q=80/sign=7a645e3e207f9e2f647a47482200c514/94cad1c8a786c917a4d1bee1ce3d70cf3ac7571c.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=fa1badeec449aaf02bdfb0cab70e6260&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=230;q=80/sign=5c39fe97992f07084b4a7040d41494a9/94cad1c8a786c917a4d1bee1ce3d70cf3ac7571c.jpg","title":"花家怡园","min_title":"花家东直门10人自选套餐","description":"10人餐！免费停车，免费WiFi！","market_price":164400,"current_price":99800,"promotion_price":99800,"sale_num":11,"score":5,"comment_num":1,"deal_url":"https://www.nuomi.com/deal/e00m14kas.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=e00m14kas"},{"deal_id":30202406,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=7cb6ef67b0712cf8119cde2d5c373cad&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=720;q=79/sign=a87cb069870a19d8df4cde450ecaaebb/f31fbe096b63f6240fa3d0db8044ebf81b4ca368.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=83b38fc484e50ba78d7b5a53d9544062&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=230;q=79/sign=08425ce21ed8bc3ed2475c8abfbb8a2e/f31fbe096b63f6240fa3d0db8044ebf81b4ca368.jpg","title":"花家怡园","min_title":"花家东直门8人自选套餐","description":"8人餐！免费停车，免费WiFi！","market_price":123000,"current_price":69800,"promotion_price":69800,"sale_num":31,"score":4.67,"comment_num":3,"deal_url":"https://www.nuomi.com/deal/r00m0ehjc.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=r00m0ehjc"}]},{"shop_id":5455698,"shop_name":"来相会饺子宴(和平里中街店)","longitude":116.42705,"latitude":39.96363,"distance":-1,"deal_num":2,"shop_url":"https://www.nuomi.com/shop/5455698","shop_murl":"https://m.nuomi.com/merchant/5455698","per_price":"5500","average_score":4.6124,"address":"北京市东城区和平里中街天元和平商业大厦2层","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C720%2C436%3Bw%3D230%3Bq%3D79/sign=f0ebc74c968fa0ec6b883e4d1ba775de/738b4710b912c8fc51f5f3b2fb039245d688214e.jpg","deals":[{"deal_id":7234470,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=25ecfd110111a1c5dc138411801647e3&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=720;q=79/sign=f11c529ff003918fc39e678a6c0d0aa7/738b4710b912c8fc51f5f3b2fb039245d688214e.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=45c6b77c0995868f6c9939603f36c455&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=230;q=79/sign=f0ebc74c968fa0ec6b883e4d1ba775de/738b4710b912c8fc51f5f3b2fb039245d688214e.jpg","title":"老边饺子馆","min_title":"来相会饺子代金券","description":"100元代金券！免费WiFi！","market_price":10000,"current_price":9000,"promotion_price":9000,"sale_num":4883,"score":4.55,"comment_num":462,"deal_url":"https://www.nuomi.com/deal/30oqslbq.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=30oqslbq"},{"deal_id":6052642,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=43d5e9314df45265c15bc66c807fd6ce&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=720;q=79/sign=a725f9c7d33f8794c7b0126eef2b22c4/64380cd7912397dd9424827b5e82b2b7d0a2876b.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=0865509169f22dbfc0529d5935e75d24&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,720,436;w=230;q=79/sign=e3e8fb708094a4c21e6cbd6b33c437e5/64380cd7912397dd9424827b5e82b2b7d0a2876b.jpg","title":"老边饺子馆","min_title":"老边饺子馆来相会代金券","description":"50元代金券！免费WiFi！","market_price":5000,"current_price":4500,"promotion_price":4500,"sale_num":8590,"score":4.58,"comment_num":1008,"deal_url":"https://www.nuomi.com/deal/gre8nfck.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=gre8nfck"}]},{"shop_id":5739988,"shop_name":"德川家日本料理(王府井in88店)","longitude":116.41781,"latitude":39.92232,"distance":-1,"deal_num":2,"shop_url":"https://www.nuomi.com/shop/5739988","shop_murl":"https://m.nuomi.com/merchant/5739988","per_price":"19900","average_score":4.55311,"address":"北京市东城区王府井大街88号王府井银泰in88商场6层","tiny_image":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C470%2C285%3Bw%3D230%3Bq%3D79/sign=6fbe2bfc30d3d539d572558307b7c560/0e2442a7d933c89577179379d71373f082020042.jpg","deals":[{"deal_id":2821685,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=1ae0f89656f27a95ea15c71e66aab39f&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,285;w=470;q=79/sign=105404c13c87e9505658a92c2d087f73/0e2442a7d933c89577179379d71373f082020042.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=b07babe662f8dc8d54b371e26d3fe5f0&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,285;w=230;q=79/sign=6fbe2bfc30d3d539d572558307b7c560/0e2442a7d933c89577179379d71373f082020042.jpg","title":"德川家","min_title":"德川家B档自助餐","description":"单人自助餐！可叠加使用！提供免费WiFi，免费WiFi！","market_price":19800,"current_price":19300,"promotion_price":19300,"sale_num":29562,"score":4.66,"comment_num":2917,"deal_url":"https://www.nuomi.com/deal/wcohrvfp.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=wcohrvfp"},{"deal_id":3723135,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=f3b2317429d28fd6903df2152c099f23&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,285;w=470;q=79/sign=cdf9271eac773912d069df21c529aa28/f2deb48f8c5494eecbe56eba28f5e0fe98257e49.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034119&di=f4e199d61ef4806356d56def74eb0067&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,285;w=230;q=79/sign=25edde11bc014a9095711cfd94471522/f2deb48f8c5494eecbe56eba28f5e0fe98257e49.jpg","title":"德川家","min_title":"德川家c档自助餐","description":"单人豪华自助餐！节假日通用，店内提供免费WiFi，免费WiFi！","market_price":29800,"current_price":28800,"promotion_price":28800,"sale_num":5371,"score":4.66,"comment_num":584,"deal_url":"https://www.nuomi.com/deal/shisvsqq.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=shisvsqq"}]}]}},"success":true};
          data = app.toJson(data);
          if(data.success){
              var shopData = data.result.data;
              maxPage = parseInt(shopData.total / page_size);//设置最大页码数
              for(var i=0;i<shopData.shops.length;i++){
                var thisDealsList = shopData.shops[i].deals;
                for(var j=0;j<thisDealsList.length;j++){
                    var thisDeals = thisDealsList[j];
                    thisDeals.market_price_yuan = app.format_money(thisDeals.market_price);//原价,转成元
                    thisDeals.current_price_yuan = app.format_money(thisDeals.current_price);//团购价格,转成元
                }
              }
              var categoryListHtml = template('categoryListTpl',shopData);
              if (page==1) {
                $('.categoryList>ul').html(categoryListHtml);
              }else{
                $('.categoryList>ul').append(categoryListHtml);
              }
              

              //其它XX个团购的按钮
              moreBtnshow();
          }
          //离线
          page++;//更新页码
          $.refreshScroller();//更新js滚动条
          // 重置加载flag
          loading = false;
          //显示滚动刷新的加载提示符
          $('.infinite-scroll-preloader').hide();
        },
        success: function(data, textStatus, xhr) {
          var data = app.toJson(data);
          console.log(data);
          if(data.success){
              var shopData = data.result.data;
              maxPage = parseInt(shopData.total / page_size);//设置最大页码数
              for(var i=0;i<shopData.shops.length;i++){
                var thisDealsList = shopData.shops[i].deals;
                for(var j=0;j<thisDealsList.length;j++){
                    var thisDeals = thisDealsList[j];
                    thisDeals.market_price_yuan = app.format_money(thisDeals.market_price);//原价,转成元
                    thisDeals.current_price_yuan = app.format_money(thisDeals.current_price);//团购价格,转成元
                }
              }
              var categoryListHtml = template('categoryListTpl',shopData);
              if (page==1) {
                $('.categoryList>ul').html(categoryListHtml);
              }else{
                $('.categoryList>ul').append(categoryListHtml);
              }
              

              //其它XX个团购的按钮
              moreBtnshow();
          }
        },
        error: function(xhr, textStatus, errorThrown) {
          //called when there is an error
        }
      });
    }

    function moreBtnshow(){
              //其它XX个团购
              $('.categoryList-content').each(function(index, el) {
                var listItemLength = $(this).find('.categoryList-content-inner').length;//商品内存在的团购数目
                if (listItemLength>2) {
                  var categoryListFooter = $(this).parents('.categoryList-item').find('.categoryList-footer');
                  categoryListFooter.show();
                  categoryListFooter.find('.moreNum').html(listItemLength-2);
                }else{
                  $(this).css('height', 'auto');//不大于于两个,列表内高度自适应
                }
              });
    }

    //跳转
    $(document).off('click','.categoryList-content-inner').on('click','.categoryList-content-inner',function () {
        var deal_id = $(this).attr("data-dealid");//商品id
        var shop_id = $(this).parents('.categoryList-content').attr("data-shopid");//店铺id
        var par = '?deal_id='+deal_id+'&shop_id='+shop_id;
        $.router.load("../goods/goodsDetail.html"+par,true);
    });

    //查看更多团购
    $(document).off('click','.moreBtn').on('click','.moreBtn',function () {
        var isOpen = $(this).attr('data-openmore');
        var itemContent = $(this).parents('.categoryList-item').find('.categoryList-content');
        var item = itemContent.find('.categoryList-content-inner');
        var itemHeight = item.height();
        var itemLength = item.length;
        var twoItemHeight = itemHeight * 2;//未展开的高度
        var allItemHeight = itemHeight * itemLength;//展开的高度
        var changeHeight = 0;
        var newIsOpenFlag = "0";
        if (isOpen=="0") {
          //未展开
          changeHeight = allItemHeight;
          newIsOpenFlag = "1";//重置flag
          $(this).find('.moreBtnIcon').removeClass('icon-down').addClass('icon-up');
        }else{
          changeHeight = twoItemHeight;
          newIsOpenFlag = "0";//重置flag
          $(this).find('.moreBtnIcon').removeClass('icon-up').addClass('icon-down');
        }
        $(this).attr( 'data-openmore' , newIsOpenFlag );
        itemContent.css({
          'height': changeHeight+"px"
        });
    });

    //更多团购动画结束后,重置js滚动条
    $(document).off('transitionend webkitTransitionEnd oTransitionEnd','.categoryList-content').on('transitionend webkitTransitionEnd oTransitionEnd','.categoryList-content',function () {
          //$.refreshScroller();//更新js滚动条
    });

        //城市列表--搜索按钮
    $(document).off('click', '#searchCityByKeyWordBtn').on('click', '#searchCityByKeyWordBtn', function(event) {
      event.preventDefault();
      if (cityData) {
        var keyword = $('#searchCityByKeyWord').val();
        if ($.trim(keyword)=="") {$.toast("请输入搜索的关键字");return false};
        var matchingArr = [];//模糊搜索匹配到的值
        for (var i = 0; i < cityData.length; i++) {
          //模糊搜索
          if(cityData[i].cityname.indexOf(keyword,0)!=-1){
            matchingArr.push( cityData[i] );
          }
        }
        if ( matchingArr.length>0 ) {
          var cityListTplHtml = template('cityListTpl',matchingArr);
          $('#matchingCityList').html( cityListTplHtml );
        }else{
          var emptyTips = '<div class="font14" style="text-align:center">对不起，没有找到“'+keyword+'”相关的城市。</div>';
          $('#matchingCityList').html( emptyTips );
        }
        $('.matchingCity').show();
      }
    });

    return exportsObj;
})