define(['zepto'],function($){

    var exportsObj = {};

/*===请求路径===*/

    var baseUrl = "/clusterscheme";//wechat项目
    var baseUrl_commcenter = "/standard_commcenter";//commcenter项目

    exportsObj.url = {
        baseUrl : baseUrl,
        baseUrl_commcenter : baseUrl_commcenter,

        findAllData : baseUrl + "/WECHAT/homepage/findAllData.do",//首页信息
        homePageCategories : baseUrl + "/WECHAT/nomi/homePageCategories.do",//首页分类栏目
        homePageShops : baseUrl + "/WECHAT/nomi/homePageShops.do",//首页商品推荐
        getAdvertList : baseUrl + "/WECHAT/advert/getAdvertList.do",//首页广告图片的接口
        getHornList : baseUrl + "/WECHAT/horn/getHornList.do",//首页小喇叭

        getNoUseCoupons : baseUrl + "/WECHAT/order/getNoUseCoupons.do",//查询可使用订单
        getWaitPayOrder : baseUrl + "/WECHAT/order/getWaitPayOrder.do",//查询未支付订单

        getPickCity : baseUrl +"/WECHAT/city/getPickCity.do",//获取城市列表
        getGdshGoodsList : baseUrl + '/WECHAT/goods/getGdshGoodsList.do',//商品列表检索
        getGdshGoodsDetail : baseUrl + '/WECHAT/goods/getGdshGoodsDetail.do',//商品详情
        getShopDetail : baseUrl_commcenter + "/nomi/getShopDetail.do",//获取店铺信息

        register : baseUrl + '/WECHAT/payUser/register.do',//注册
        login : baseUrl + '/WECHAT/payUser/login',//登录
        getUser : baseUrl + '/WECHAT/payUser/getUser.do',//获取手机验证码
        getCode : baseUrl + '/WECHAT/authCode/getCode.do',//获取手机验证码

        getCoupons : baseUrl + '/WECHAT/order/getCoupons.do',//获取卡券ID
        getGdshSaleData : baseUrl + '/WECHAT/goods/getGdshSaleData.do',//查询商品库存;gdshGoodStatus为1时可售,0为不可售
    };

/*===公用方法===*/

    //把json字符串转成 json对象
    exportsObj.toJson = function(data){
      if (typeof data == "string") {
            return JSON.parse(data);
      }else{
            return data
      }
    }

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

    //在sessionStorage中设置title的值
    exportsObj.setTitle = function(str){
      if (typeof str == 'string') {
        sessionStorage.pageTitle = str;
      }else{
        sessionStorage.pageTitle = "生活平台";
      }
    }
    //在sessionStorage中获取title的值
    exportsObj.getTitle = function(){
      var title = sessionStorage.pageTitle;
      if (typeof title != 'string') {
         title = "生活平台";
      }
      return decodeURI(title);
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

    exportsObj.getCookie = function(name){
	    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	    if(arr=document.cookie.match(reg)){
	    	return unescape(arr[2]);
	    }
	    else{
	    	return undefined;
	    }
    }

    /*登录状态,用sessionStorage记录*/
    exportsObj.setUserObj = function(obj){
      console.info("设置sessionStorage.userobj:"+obj);
      sessionStorage.userobj = JSON.stringify(obj);
    }

    exportsObj.getUserObj = function(){
      if (typeof sessionStorage.userobj == 'undefined') {
        return false;
      }
      return JSON.parse(sessionStorage.userobj);
    }

    exportsObj.isLogin = function(){
      if (exportsObj.getUserObj()&&exportsObj.getUserObj().USERID!="") {
            return true;
      }
      return false;
    }

    exportsObj.removeUserObj = function(){
      if (typeof sessionStorage.userobj != 'undefined') {
        sessionStorage.removeItem("userobj");
      }
    }

    /**
     * 格式化金额-分转元
     * @param {Object} num 传入金钱数值
     */
   exportsObj.format_money =  function(num){

      var str = (num/100).toFixed(2) + '';
      //var intSum = str.substring(0,str.indexOf(".")).replace( /\B(?=(?:\d{3})+$)/g, ',' );//取到整数部分
      var intSum = str.substring(0,str.indexOf(".")).replace( /\B(?=(?:\d{3})+$)/g, '' );//取到整数部分
      var dot = str.substring(str.length,str.indexOf("."))//取到小数部分
      var ret = intSum + dot;
      return ret;

    }

    /**
    * 格式化金额
    * @param {Object} strMoney 传入格式为"3,125,486.25"的金额
    * return string (格式："3125486.25")
    */
    exportsObj.changeMoneyMode2 = function(strMoney) {
      var oldMoney = strMoney;
      var newMoney = "";
      for (var i = 0;  i < oldMoney.length; i++) {
        if (oldMoney[i] != ",") {
          newMoney = newMoney + oldMoney.substring(i,i+1);
        }
      }
      return newMoney;
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
    //判断本月多少天
    exportsObj.month_length = function(year,month){
      if (month == 2) {
        if (year % 4 != 0) {
          return 28;
        }
        else if (year % 100 == 0 && year % 400 != 0) {
          return 28;
        }
        else {
          return 29;
        }
      }
      else if (month == 4 || month == 6 || month == 9 || month == 11) {
        return 30;
      }
      else {
        return 31;
      }
    }

    return exportsObj;//暴露接口

})
