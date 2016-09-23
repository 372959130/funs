define(['app','template','smExtend'],function(app,template,smExtend){
    var exportsObj = {};
    exportsObj.init = function(){
      app.setPageTitle("分类");
      //初始化swiper
      $('.homeBanner>.swiper-container').swiper({
          pagination: '.swiper-pagination',
          paginationClickable: true,
          autoplay: 30000,
          autoplayDisableOnInteraction: false
      });
      $.refreshScroller();//更新js滚动条
    }

    //跳转
    $(document).off('click','#index .goodsItem').on('click','#index .goodsItem',function () {
        var goodid = $(this).data("goodid");
        $.router.load("../goodsDetail/goodsDetail.html?goodid="+goodid,true);// ignoreCache 是加载一个新页面时是否忽略缓存而发网络请求，默认是 false，表示使用缓存，可以设为 true 来忽略缓存
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
        var newIsOpenFlag = 0;
        if (isOpen==0) {
          //未展开
          changeHeight = allItemHeight;
          newIsOpenFlag = 1;//重置flag
          $(this).find('.moreBtnIcon').removeClass('icon-down').addClass('icon-up');
        }else{
          changeHeight = twoItemHeight;
          newIsOpenFlag = 0;//重置flag
          $(this).find('.moreBtnIcon').removeClass('icon-up').addClass('icon-down');
        }
        $.alert(newIsOpenFlag);
        $.alert(changeHeight);
        $(this).attr( 'data-openmore' , newIsOpenFlag );
        itemContent.css('height', changeHeight + 'px' );
    });

    //更多团购动画结束后,重置js滚动条
    $(document).off('transitionend webkitTransitionEnd oTransitionEnd','.categoryList-content').on('transitionend webkitTransitionEnd oTransitionEnd','.categoryList-content',function () {
          $.refreshScroller();//更新js滚动条
    });

    return exportsObj;
})
