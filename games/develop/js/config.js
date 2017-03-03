require.config({
    baseUrl : '../../../js/entry/',//相对HTML
    paths : {
        // tool
        FastClick : '../tool/fastclick',//兼容移动端点击//防止300ms点击延时
        jquery : '../tool/jquery-3.1.0.min',
        Swiper : '../tool/swiper-3.3.1.jquery.min-AMD',//滑动插件
        // fun
        app : '../fun/app',//公共JS
        template : '../tool/artTemplate',//JS模板引擎
        loading : '../fun/loading',
        //大转盘
        wheelRun : '../fun/wheel/wheelRun',//大转盘转动(8格)
        wheelPrizePostion_8 : '../fun/wheel/wheelPrizePostion_8',//大转盘奖品定位(8格)
        
    }
});