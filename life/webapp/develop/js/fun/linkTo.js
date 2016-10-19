/*===页面跳转===*/

define(['zepto','app'], function($, app) {
    var request = app.getRequest();//获取url参数,组装为对象
    var customerChannelId = request.customerChannelId;//从url中获取渠道id

    if (typeof customerChannelId == 'undefined') {console.warn("url参数:customerChannelId为空")};
    var commonPar = '?customerChannelId='+customerChannelId;//公共参数

    var exportsObj = {};
    /**
     * 商品详情页
     * deal_id:商品id
     * shop_id:商户id
     */
    exportsObj.goodsDetail = function(goodId){
        var par = commonPar+'&goodId='+goodId;
        $.router.load("../goods/goodsDetail.html"+par,true);
    }
    /**
     * 首页
     */
    exportsObj.index = function(){
        var par = commonPar;
        $.router.load("../index/index.html"+par,true);
    }
    /**
     * 我的
     */
    exportsObj.my = function(){
        var par = commonPar;
        $.router.load("../my/my.html"+par,true);
    }
    /**
     * 商品列表页
     * catid:分类ID
     */
    exportsObj.categoryList = function(catid){
        var par = commonPar+'&catid='+catid;
        $.router.load("../categoryList/categoryList.html"+par,true);
    }
     /**
     * 未支付订单页面
     */
    exportsObj.waitPayOrder = function(){
        var par = commonPar;
        $.router.load("../order/waitPayOrder.html"+par,true);
    }
    /**
     * 可使用订单页面
     */
    exportsObj.orderUse = function(){
        var par = commonPar;
        $.router.load("../order/orderUse.html"+par,true);
    }

    return exportsObj;
});

