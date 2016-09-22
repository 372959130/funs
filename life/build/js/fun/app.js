define(['zepto'],function($){

    var exportsObj = {};

    exportsObj.include = function(file) {
      var files = typeof file == "string" ? [ file ] : file;
      for (var i = 0; i < files.length; i++) {
        var name = files[i].replace(/^\s|\s$/g, "");
        var att = name.split('.');
        var ext = att[att.length - 1].toLowerCase();
        var isCSS = ext == "css";
        if (isCSS) {
          var link = document.createElement('link',"pageCSS");
          link.type = 'text/css';
          link.rel = 'stylesheet';
          link.href = files[i];
          document.getElementsByTagName("head")[0].appendChild(link);
        } else {
          var script = document.createElement("script","pageJS");
          script.type = "text/javascript";
          script.src = files[i];
          document.getElementsByTagName("head")[0].appendChild(script);
        }
      }
    }
    //调用接口方法
    exportsObj.invoke_trancode = function (trancode,params,callBack) {
        console.log("trancode===========" + trancode);
        console.log("params===========" + JSON.stringify(params));
        $.ajax({
          url : app.cfg.base + trancode,
          data : params,
          type : "post",
          async : true, //异步
          cache : false,
          success : function(data) {
            //$.busyhide();
            console.log("trancode===========" + trancode + "------返回");
            console.log("params===========" + JSON.stringify(data) + "------返回");
            callBack.call(this,data);
          }
        });
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
     * 页面跳转方法
     * @param {String} url 模块路径
     * @param {Object} pageParams 页面间跳转参数传递
     * @param {boolean} ignoreCache ignoreCache 是加载一个新页面时是否忽略缓存而发网络请求，默认是 false，表示使用缓存，可以设为 true 来忽略缓存
     */
    exportsObj.goPage = function(url,pageParams,ignoreCache) {//
        if(typeof pageParams == "object"){
          var params = JSON.stringify(pageParams);
          sessionStorage.setItem("params",params);
        }
        $.router.load(url,ignoreCache);
    }
    //获取上一个页面params
    exportsObj.getPageParams = function(){
      var pageParams = sessionStorage.getItem("params");
      if(pageParams != null){
        return JSON.parse(pageParams);
      }else{
        return {};
      }

    }

    /**
     * 格式化金额
     * @param {Object} num 传入金钱数值
     * @param {Object} isThousand 是否需要逗号隔开(bool)
     * @param {Object} cent 小数位数
     */
     exportsObj.format_money = function(num,isThousand,cent){
      var sign = "";
      if (parseFloat(num)<0){
        sign = "-" ;
      }
      num = Math.abs(parseFloat(num)).toString();
      if(isNaN(cent)){//确保传入小数位为数值型数值.
        cent = 0;
      }
      cent = parseInt(cent);
      var array = num.split(".");
      if (isNaN(array[1])) {
        array[1] = "0";
      }
      while(array[1].length<cent) {
        array[1] = array[1] + "0";
      }


      if(!isThousand){ //不需要千分位符.
        if (cent == 0){
          return ( sign + array[0] );
        }else{
          return ( sign + array[0] + "." + array[1].substring(0,cent));
        }
      }else{
        for (var i = 0; i < Math.floor((array[0].length-(1+i))/3); i++){
          array[0] = array[0].substring(0,array[0].length-(4*i+3))+','+
          array[0].substring(array[0].length-(4*i+3));
        }
        if (cent == 0){
          return (sign + array[0]);
        }else {
          return (sign + array[0] + '.' + array[1].substring(0,cent));
        }
      }

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

    //判断身份证是否合法
    exportsObj.checkcard = function(card){
            var vcity={ 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
                21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
                33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",
                42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",
                51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",
                63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
              };
        //检查号码是否符合规范，包括长度，类型
        isCardNo = function(card)
        {
            //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
            if(reg.test(card) === false)
            {
                return false;
            }

            return true;
        };

        //取身份证前两位,校验省份
        checkProvince = function(card)
        {
            var province = card.substr(0,2);
            if(vcity[province] == undefined)
            {
                return false;
            }
            return true;
        };

        //检查生日是否正确
        checkBirthday = function(card)
        {
            var len = card.length;
            //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
            if(len == '15')
            {
                var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
                var arr_data = card.match(re_fifteen);
                var year = arr_data[2];
                var month = arr_data[3];
                var day = arr_data[4];
                var birthday = new Date('19'+year+'/'+month+'/'+day);
                return verifyBirthday('19'+year,month,day,birthday);
            }
            //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
            if(len == '18')
            {
                var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
                var arr_data = card.match(re_eighteen);
                var year = arr_data[2];
                var month = arr_data[3];
                var day = arr_data[4];
                var birthday = new Date(year+'/'+month+'/'+day);
                return verifyBirthday(year,month,day,birthday);
            }
            return false;
        };

        //校验日期
        verifyBirthday = function(year,month,day,birthday)
        {
            var now = new Date();
            var now_year = now.getFullYear();
            //年月日是否合理
            if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day)
            {
                //判断年份的范围（3岁到100岁之间)
                var time = now_year - year;
                if(time < 60)
                {
                    //alert('您的年龄已超龄，抱歉！');
                    return true;
                }else{
                    return "false60";
                }

            }
            return false;
        };

        //校验位的检测
        checkParity = function(card)
        {
            //15位转18位
            card = changeFivteenToEighteen(card);
            var len = card.length;
            if(len == '18')
            {
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var cardTemp = 0, i, valnum;
                for(i = 0; i < 17; i ++)
                {
                    cardTemp += card.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[cardTemp % 11];
                if (valnum == card.substr(17, 1))
                {
                    return true;
                }
                return false;
            }
            return false;
        };

        //15位转18位身份证号
        changeFivteenToEighteen = function(card)
        {
            if(card.length == '15')
            {
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var cardTemp = 0, i;
                card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
                for(i = 0; i < 17; i ++)
                {
                    cardTemp += card.substr(i, 1) * arrInt[i];
                }
                card += arrCh[cardTemp % 11];
                return card;
            }
            return card;
        };


          //校验长度，类型
          if(isCardNo(card) === false)
          {
              alert('您输入的身份证号码不正确，请重新输入');

              return false;
          }
          //检查省份
          if(checkProvince(card) === false)
          {
              alert('您输入的身份证号码不正确,请重新输入');

              return false;
          }
          //校验生日
          if(checkBirthday(card) == "false60")
          {
              // alert('您输入的身份证号码生日不正确,请重新输入');
              alert('您的年龄已超龄，抱歉！');
              return false;
          }else if(checkBirthday(card) === false){
              alert('您输入的身份证号码生日不正确,请重新输入');
              // alert('您的年龄已超龄，抱歉！');
              return false;
          }
          //检验位的检测

          if(checkParity(card) === false)
          {
              alert('您的身份证校验位不正确,请重新输入');

              return false;
          }

          return true;
    }

    // $.fn.yanpenttest = function(){
    //   console.log("test");
    // }

    return exportsObj;//暴露接口

})
