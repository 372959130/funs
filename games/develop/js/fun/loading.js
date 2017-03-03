;(function(){
    /*加载loading.js时即刻触发*/
    /*===页面首次加载时的loading效果===*/
    var body =  document.getElementsByTagName('body')[0];
    var bodyAttr_Arr = body.attributes;
    var bodyAttr_Flag = false;
    //判断body是否设置pageloading属性
    for (var i = 0; i < bodyAttr_Arr.length; i++) {
        if ( bodyAttr_Arr[i].name == 'pageloading' ){
            bodyAttr_Flag = true;
            break;
        };
    }
    if( !bodyAttr_Flag ){
        //如果body没有设置pageloading='true',不显示loading
        console.warn('如需显示页面初始化loading,请设置<body pageloading>');
        return false;
    }

    var global_loading_1 = {
          style1 : 'display: none;'+
              'background-color: #34495E;'+
              'position: fixed;'+
              'width: 100%;'+
              'height: 100%;'+
              'left: 0;'+
              'top: 0;'+
              'z-index: 9999;',
          style2 : 'position: absolute;'+
              'width: 100%;'+
              'height: 300px;'+
              'top: 0;'+
              'right: 0;'+
              'bottom: 0;'+
              'left: 0;'+
              'margin: auto;'+
              'text-align: center;'+
              'z-index: 1;'
    }
    var pageLoading =  '<div id="__PageLoading__" style="'+global_loading_1.style1+'"><div  style="'+global_loading_1.style2+'"><img src="../../../images/common/pageLoading.svg" width="100" height="100"><div style="color: #ccc;margin-top: 5px;line-height: 1.7;" class="font12">稍等片刻<br/>应用加载中</div></div></div>';
        var newNode = document.createElement("div");
        newNode.innerHTML = pageLoading;
        var parentDOM = body.parentNode;
        parentDOM.insertBefore(newNode,parentDOM.childNodes[1]);//把loading插入body前
        document.getElementById('__PageLoading__').style.display = 'block';
      body.style.display = 'block';
})();