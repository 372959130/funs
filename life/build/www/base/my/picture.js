define(['zepto','smExtend','app'],function($,smExtend,app){
  var exportsObj = {};
  exportsObj.init = function () {
    app.setPageTitle("相册");
    /*=== 默认为 standalone ===*/
    var myPhotoBrowserStandalone = $.photoBrowser({
        photos : [
            '//img.alicdn.com/tps/i3/TB1kt4wHVXXXXb_XVXX0HY8HXXX-1024-1024.jpeg',
            '//img.alicdn.com/tps/i1/TB1SKhUHVXXXXb7XXXX0HY8HXXX-1024-1024.jpeg',
            '//img.alicdn.com/tps/i4/TB1AdxNHVXXXXasXpXX0HY8HXXX-1024-1024.jpeg',
        ]
    });
    //点击时打开图片浏览器
    $(document).off('click','.pb-standalone').on('click','.pb-standalone',function () {
      myPhotoBrowserStandalone.open();
    });

    /*=== Popup ===*/
    var myPhotoBrowserPopup = $.photoBrowser({
        photos : [
            '//img.alicdn.com/tps/i3/TB1kt4wHVXXXXb_XVXX0HY8HXXX-1024-1024.jpeg',
            '//img.alicdn.com/tps/i1/TB1SKhUHVXXXXb7XXXX0HY8HXXX-1024-1024.jpeg',
            '//img.alicdn.com/tps/i4/TB1AdxNHVXXXXasXpXX0HY8HXXX-1024-1024.jpeg',
        ],
        type: 'popup'
    });
    $(document).off('click','.pb-popup').on('click','.pb-popup',function () {
      myPhotoBrowserPopup.open();
    });

    /*=== 有标题 ===*/
    var myPhotoBrowserCaptions = $.photoBrowser({
        photos : [
            {
                url: '//img.alicdn.com/tps/i3/TB1kt4wHVXXXXb_XVXX0HY8HXXX-1024-1024.jpeg',
                caption: 'Caption 1 Text'
            },
            {
                url: '//img.alicdn.com/tps/i1/TB1SKhUHVXXXXb7XXXX0HY8HXXX-1024-1024.jpeg',
                caption: 'Second Caption Text'
            },
            // 这个没有标题
            {
                url: '//img.alicdn.com/tps/i4/TB1AdxNHVXXXXasXpXX0HY8HXXX-1024-1024.jpeg',
            },
        ],
        theme: 'dark',
        type: 'standalone'
    });
    $(document).off('click','.pb-standalone-captions').on('click','.pb-standalone-captions',function () {
      myPhotoBrowserCaptions.open();
    });
  }

  return exportsObj;

})
