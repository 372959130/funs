define(['jquery'],function($){

    var exportsObj = {};

/**=======获取url参数=======*/
    exportsObj.getRequest = function(){
      var url = location.search; //获取url中"?"符后的字串
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
           theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    }
    /**
     *SPA设置页面title方法
     *@param {String} pageTitle 需要设置的title名称
     */
    exportsObj.setPageTitle = function(pageTitle){
        if (pageTitle) {
            document.title = pageTitle;
            if ($.device.isWeixin && $.device.ios ) {
              // 微信前端开发有哪些坑或者黑魔法？
              // https://www.zhihu.com/question/27849091/answer/38399344
              // 解决在 iOS 微信的 webview 中只能修改一次 document.title 的黑魔法
              // XXX 由于只会在 iOS 微信上遇到这个问题, 因此需要添加判断, 非微信就去掉这个黑魔法
              $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
                  setTimeout(function() {
                      $(this).off('load').remove()
                  }.bind(this), 0);
              }).appendTo(document.body);
            }
        }
    }

    /**
     * [判断img为 mustload=true 的图片全部加载完毕]
     * @param  {Function} callback [mustload=true的图片全部加载完毕后,调用回调函数]
     */
    exportsObj.imgLoad = function(callback){
      var imgLoadIntervalTimer = setInterval(function(){
          var imgHasLoaded = 0;
          $('img[mustload=true]').each(function(index, el) {
            if (this.complete) {
              imgHasLoaded++
            }
            if ($('img[mustload=true]').length == imgHasLoaded) {
              console.log('imgLoad Complete');
              clearInterval(imgLoadIntervalTimer);
              if (typeof callback == 'function') {
                callback();
              }
            }
          });
        },500)
    }
    /**
     * [隐藏loading,,配合loading.js使用]
     */
    exportsObj.hidePageLoading = function(){
      $('#__PageLoading__').fadeOut(600,function(){
        $('#__PageLoading__').remove();
      });
    }

    /**
    * 手机号保护
    * @param {Object} strMoney 传入格式为"13812345678"的卡号
    * return string (格式："138****5678")
    */
    exportsObj.protectMobileNo = function(mobileNo) {
      var str1=mobileNo.substring(0,3);
      var str2="****";
      var str3=mobileNo.substring(mobileNo.length-4,mobileNo.length);
      return str1+str2+str3;
    }

    //只能输入数字
    exportsObj.only_number = function(el){
      el.value = el.value.replace(/[^0-9]/g,'');
    }
    //输入数字和字母
    exportsObj.letter_number = function(el){
       el.value = el.value.replace(/[^0-9a-zA-Z]/g,'');
    }
    //数字和两位小数
    exportsObj.number_point = function(el){
      el.value = (function(a){
        return a.length > 1 ? a.shift().replace(/\D/g, '') + '.'+ a.join('').replace(/\D/g, '').slice(0, 2) : a[0].replace(/\D/g, '');
      })(el.value.split(/\./));
    }

    return exportsObj;//暴露接口

})
