define(["smExtend","template","app"],function(i,o,t){var e={},n="";return e.init=function(i){console.log("goodsDetail.js=>init"),$.alert("切换页面时,每次会执行对应模块的init函数"),t.setPageTitle("商品详情"),$.ajax({url:"../../../json/goodlist.json",type:"GET",success:function(t){"string"==typeof t&&(t=JSON.parse(t));for(var e=0;e<t.list.length;e++)if(t.list[e].goodId==i.goodid){var a=o("swiper_TPL",t.list[e].imgDetail);$("#goodsDetail").find(".swiper-wrapper").html(a),$("#goodsName").html(t.list[e].goodName)}n=$("#goodsDetail").find(".swiper-container").swiper({pagination:".swiper-pagination",paginationClickable:!0,autoplay:1e3,autoplayDisableOnInteraction:!0})}})},e.destroy=function(){n.destroy(),console.log("goodsDetail.js=>destroy")},e});