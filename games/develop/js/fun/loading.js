!function(){for(var e=document.getElementsByTagName("body")[0],t=e.attributes,i=!1,o=0;o<t.length;o++)if("pageloading"==t[o].name){i=!0;break}if(!i)return console.warn("如需显示页面初始化loading,请设置<body pageloading>"),!1;var n={style1:"display: none;background-color: #34495E;position: fixed;width: 100%;height: 100%;left: 0;top: 0;z-index: 9999;",style2:"position: absolute;width: 100%;height: 300px;top: 0;right: 0;bottom: 0;left: 0;margin: auto;text-align: center;z-index: 1;"},a='<div id="__PageLoading__" style="'+n.style1+'"><div  style="'+n.style2+'"><img src="../../../images/base/common/pageLoading.svg" width="100" height="100"><div style="color: #ccc;margin-top: 5px;line-height: 1.7;" class="font12">稍等片刻<br/>应用加载中</div></div></div>',d=document.createElement("div");d.innerHTML=a;var l=e.parentNode;l.insertBefore(d,l.childNodes[1]),document.getElementById("__PageLoading__").style.display="block",e.style.display="block"}();