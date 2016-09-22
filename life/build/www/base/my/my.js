define(['zepto','app'],function($,app){
  var exportsObj = {};
  exportsObj.init = function () {
    app.setPageTitle("我的");
  }
  $(document).off('click','#my .item-inner').on('click','#my .item-inner',function(){
    var link = $(this).data('link');
    $.router.load(link,false);
  })
  return exportsObj;
})
