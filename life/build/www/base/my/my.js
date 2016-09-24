define(['zepto','app'],function($,app){
  var exportsObj = {};
  exportsObj.init = function () {
    app.setPageTitle("我的天tian");
    setInterval( function(){ console.log(0);$('#autofocus')[0].focus(); console.log(1);},500 )
  }
  $(document).off('click','#my .item-inner').on('click','#my .item-inner',function(){
    var link = $(this).data('link');
    $.router.load(link,false);
  })
  return exportsObj;
})
