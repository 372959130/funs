define(['zepto','linkTo'],function($,linkTo){
    var footerHTML = 
            '<nav class="bar bar-tab">'+
                '<a data-tabid="home" id="nav-index" class="tab-item footer_borderR" href="javascript:;">'+
                    '<span class="icon my-icon my-icon-index"></span>'+
                    '<span class="tab-label">首页</span>'+
                '</a>'+
                '<a data-tabid="my" id="nav-my" class="tab-item" href="javascript:;">'+
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
                $(document).off('click', '#nav-index').on('click', '#nav-index',function(event) {
                  linkTo.index();
                });
                $(document).off('click', '#nav-my').on('click', '#nav-my',function(event) {
                  linkTo.my();
                });
            }
        }
});