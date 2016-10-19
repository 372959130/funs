define(['zepto'],function($){
	var hasBaiduPointTimer;
	var exports = {};
	//异步加载百度地图JS
	//参数callback为 加载完该js后,调用的方法
	exports.loadScript = function(){
		var script = document.createElement("script");  
		script.src = "http://api.map.baidu.com/api?v=2.0&ak=vSY6UbC7hvUr6wmOSeReB6ptb05C5UhK&callback=baiduMapCallback";
		document.body.appendChild(script);  
	}
	//获取当前经纬度
	//getPointSuccessCallback成功获取经纬度时的回调函数
	exports.getPoint = function(){
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r){
		    if(this.getStatus() == BMAP_STATUS_SUCCESS){
		        //r.point.lng 经度
		        //r.point.lat 纬度
		        getPointSuccessCallback( r );
		    }
		    else {
		        alert('failed'+this.getStatus());
		    }        
		},{enableHighAccuracy: true})
	}

	//轮询 window.globalBaiduPoint ,有window.globalBaiduPoint则获取到了用户的位置
	exports.hasBaiduPoint = function(callback,data){
		clearInterval(hasBaiduPointTimer);//清除轮询
		hasBaiduPointTimer = setInterval(function(){
			if ( window.globalBaiduPoint!="" && typeof window.globalBaiduPoint !="undefined" && window.globalBaiduPoint!=null ) {
				typeof callback == 'function' && callback(data);//执行回调
				clearInterval(hasBaiduPointTimer);//清除轮询
			}
		},300);
	}

	//getPointSuccessCallback成功获取经纬度时的回调函数
	function getPointSuccessCallback(r){
		window.globalBaiduPoint = r;
	}

/*	
	//获取当前经纬度
	exports.getPoint = function(){
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r){
		    if(this.getStatus() == BMAP_STATUS_SUCCESS){
		        var mk = new BMap.Marker(r.point);
		        //r.point.lng 经度
		        //r.point.lat 纬度
		        alert('您的位置：'+r.point.lng+','+r.point.lat);
		        var map = new BMap.Map("allmap");
		        var pointA = new BMap.Point(116.3835,39.988552);  //北京市海淀区龙翔路甲1号健翔桥市场二层
		        var pointNow = new BMap.Point(r.point.lng,r.point.lat);  // 当前位置
		alert('从大渡口区到江北区的距离是：'+(map.getDistance(pointA,pointNow)).toFixed(2)+' 米。');  //获取两点距离,保留小数点后两位
		        return r.point;//返回含有经纬度的对象
		    }
		    else {
		        alert('failed'+this.getStatus());
		        return false;
		    }        
		},{enableHighAccuracy: true})
	}
	   */
	return exports;
});

