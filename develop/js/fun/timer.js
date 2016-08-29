// var time;
//计时器 用worker可以解决移动端锁屏导致计时器暂停Bug 
function timeout(time) {
	var clock=setInterval(function() {
		time=time*1 - 1;
		if (time != 0) {
           postMessage(time);
		}else{
           clearInterval(clock);
		}
	}, 1000);
}

this.addEventListener("message", function(e){
	timeout(e.data);
});

//用法
// $(function(){
//     var myworker= new Worker("timer.js");
//     $('#button').on('click',function(e){
//     	myworker.postMessage(60);
       
//     });

//     myworker.addEventListener("message", function(e){
// 		$('#count').html(e.data)
// 	});

// });