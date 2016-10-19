//样式对应 sass/widget/popup/_dialog.scss

define(['zepto','sm','app'],function($,sm,app){
  var exportsObj = {};

  var baseHtml = 
              '<div class="homeBanner pTimgBox_42667" id="advertBanner">'+
                '<div class="swiper-container">'+
                  '<div class="swiper-wrapper">'+
                    '<div class="swiper-slide"><img src=""></div>'+
                  '</div>'+
                  '<div class="swiper-pagination"></div>'+
                '</div>'+
             '</div>';

    /**
     * [获取广告图]
     * @param  {[string]} showarea [分类id,如果是首页,则showarea为0]
     * @param  {[string]} targetDomSelectName [生成banner图的dom元素zepto选择器]
     */
    exportsObj.init = function( showarea , targetDomSelectName ){
      $.ajax({
        url: app.url.getAdvertList,
        type: 'POST',
        data : {
          customerChannelId : app.getRequest().customerChannelId,
          showarea : showarea
        },
        success: function(data, textStatus, xhr) {
          var data = app.toJson(data);
          console.log('getAdvertList',data);
          if (data.code==0) {

            var advertListHtml = '';
            for (var i = 0; i < data.data.advertList.length; i++) {
              var that = data.data.advertList[i];
              advertListHtml += '<div class="swiper-slide advertLink" data-linkurl="'+that.linkUrl+'"><img src="'+that.photo_url+'" alt="loading..."></div>'
            }

            $(targetDomSelectName).html(baseHtml);

            $('#advertBanner').find('.swiper-wrapper').html( advertListHtml );

            bindEvent();

          }
        }
      }); 
    }

    function bindEvent(){
      //初始化swiper
      $('#advertBanner>.swiper-container').swiper({
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false
      });
      //跳转
      $(document).off('click','.advertLink').on('click','.advertLink',function () {
          var linkurl = $(this).attr('data-linkurl');
          if (linkurl) {
            location.href = linkurl;
          }
      });
      $.refreshScroller();//更新js滚动条
    }

    return exportsObj;
})