define(['zepto'],function($){
    var footerHTML = 
            '<nav class="bar bar-tab">'+
                '<a data-tabid="home" class="tab-item footer_borderR" href="../index/index.html">'+
                    '<span class="icon my-icon my-icon-index"></span>'+
                    '<span class="tab-label">首页</span>'+
                '</a>'+
                '<a data-tabid="my" class="tab-item" href="../my/my.html" data-no-cache="true">'+
                    '<span class="icon my-icon my-icon-my"></span>'+
                    '<span class="tab-label">我的</span>'+
                '</a>'+
            '</nav>';
        return {
            init : function(targetDom){
                if (targetDom.length<0) {console.warn("放置footer的容器为空");return};
                targetDom.after( footerHTML );
                var acive = targetDom.attr('data-acive');//根据targetDom的data-acive来确定高亮的tab
                $('.tab-item[data-tabid='+acive+']').addClass('active');//添加高亮样式
            }
        }
});