define(["sm","app"],function(i,t){var n={};return n.init=function(i){function n(i,t){for(var n="",e=t+1;e<=t+i;e++)n+='<li class="item-content"><div class="item-inner"><div class="item-title">Item '+e+"</div></div></li>";$(".infinite-scroll-bottom .list-container").append(n)}t.setPageTitle("设置");var e=!1,o=30,l=15,r=l;n(l,0),$(document).off("infinite","#setting .infinite-scroll-bottom").on("infinite","#setting .infinite-scroll-bottom",function(){e||(e=!0,setTimeout(function(){return e=!1,r>=o?($.toast("已经加载完毕啦!"),$.detachInfiniteScroll($(".infinite-scroll")),void $(".infinite-scroll-preloader").remove()):(n(l,r),r=$(".list-container li").length,void $.refreshScroller())},1e3))})},n});