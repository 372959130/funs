define(['app','template','smExtend'],function(app,template,smExtend){
    var exportsObj = {};
    exportsObj.init = function(){
      app.setPageTitle("主页");
      //初始化swiper
      $('.homeBanner>.swiper-container').swiper({
          pagination: '.swiper-pagination',
          paginationClickable: true,
          autoplay: 1000,
          autoplayDisableOnInteraction: false
      });
    }

    var is_detachInfiniteScroll = false;//是否销毁无限加载事件flag
    /*上拉刷新*/
    // 添加'refresh'监听器
    $(document).off('refresh','#home #myRefresh').on('refresh','#home #myRefresh',function(e) {
        // 模拟加载过程
        setTimeout(function() {
            $.ajax({
                url: '../../../json/goodlist.json',
                type: 'GET',
                success : function(data){
                    if (typeof data == 'string') {
                      data = JSON.parse(data);
                    }
                    //模拟加载次数
                    //相当于分页功能
                    var mydata = data.list.slice( 0 , 4 );//初始化刷新前4条数据
                    //模拟加载次数.end
                    var html = template('goodlist_TPL', mydata);
                    $('#goodList').html(html);
                },
                complete : function(){
                    // 加载完毕需要重置
                    $.pullToRefreshDone('.pull-to-refresh-content');

                    //滚动刷新
                    if (is_detachInfiniteScroll) {
                      //注意，仅在你使用$.detachInfiniteScroll方法删除过事件监听器后，才可能需要使用 $.attachInfiniteScroll方法，因为无限滚动组件的事件监听器会在“initPage”时被自动添加。
                      $.attachInfiniteScroll($('#myRefresh'));
                    }

                }
            })
        }, 600);
    });
    //首次进入,JS触发下拉刷新
    $.pullToRefreshTrigger('.pull-to-refresh-content');

    //滚动刷新
    // 加载flag
    var loading = false;

    // 最多可加载的条目
    var maxItems = 0;

    // 每次加载添加多少条目
    var itemsPerLoad = 2;

    // 上次加载的序号

    var lastIndex = 0;

    // 注册'infinite'事件处理函数

    $(document).off('infinite', '#home #myRefresh').on('infinite', '#home #myRefresh',function() {

        // 如果正在加载，则退出
        if (loading) return;

        //显示滚动刷新的加载提示符
        $('.infinite-scroll-preloader').show();

        // 设置flag
        loading = true;

        setTimeout(function() {
            $.ajax({
                url: '../../../json/goodlist.json',
                type: 'GET',
                beforeSend : function(){
                  lastIndex = $('#goodList').find('.goodsItem').length;
                },
                success : function(data){
                    //模拟加载
                    maxItems = data.list.length;//最多可加载的条目
                    var mydata = data.list.slice( lastIndex , lastIndex + itemsPerLoad );
                    if (lastIndex>=maxItems) {
                        $.toast('没有更多商品咯~');
                        // 加载完毕，则注销无限加载事件，以防不必要的加载
                        $.detachInfiniteScroll($('#myRefresh'));
                        is_detachInfiniteScroll = true;//是否销毁无限加载事件flag
                        // 删除加载提示符
                        $('.infinite-scroll-preloader').hide();
                        return;
                    }
                    //模拟加载.end
                    var html = template('goodlist_TPL', mydata);
                    $('#goodList').append(html);
                    //更新上次加载序号
                    lastIndex = $('#goodList').find('.goodsItem').length;
                },
                complete : function(){
                    // 重置加载flag
                    loading = false;
                    //显示滚动刷新的加载提示符
                    $('.infinite-scroll-preloader').hide();
                }
            })
        }, 600);
    });



    //跳转
    $(document).off('click','#home .goodsItem').on('click','#home .goodsItem',function () {
        var goodid = $(this).data("goodid");
        $.router.load("../goodsDetail/goodsDetail.html?goodid="+goodid,true);// ignoreCache 是加载一个新页面时是否忽略缓存而发网络请求，默认是 false，表示使用缓存，可以设为 true 来忽略缓存
    });
    return exportsObj;
})
