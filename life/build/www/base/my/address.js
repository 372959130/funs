define(['zepto','smCityPicker','app'],function($,smCityPicker,app){
  var exportsObj = {};
  exportsObj.init = function () {
    app.setPageTitle("收货地址");
    $("#city-picker").cityPicker({
      toolbarTemplate: '<header class="bar bar-nav">\
      <button class="button button-link pull-right close-picker">确定</button>\
      <h1 class="title">选择收货地址</h1>\
      </header>'
    });
  }
  return exportsObj;
})
