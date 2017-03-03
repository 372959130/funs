/*
*  大转盘---默认8格
*  根据index,转动对应index的位置 index 取值为 0 - (wheelNum-1)
*  @lzsheng02
*  2016.09.01
 */
define(['jquery'],function($){
    var port = {};

    /**
     * [转盘旋转]
     * @param  {[number]} index  [旋转前,奖品在转盘的位置index]
     * @param  {[function]} runEnd_callback  [旋转结束后,会调用该方法]
     * @param  {[number]} minRot [至少转多少圈,默认为5]
     * @param  {[number]} wheelNum [转盘格数,默认为8]
     */
    function run(index,runEnd_callback,minRot,wheelNum){
        console.log("index:",index);
        var $wheel = $('#runWheel');
        if ($wheel.length==0) {console.error('转动的dom元素,id必须为"runWheel"');return false};
        if (typeof minRot == 'undefined') {
            minRot = 5;//默认转5圈
        }
        if (typeof wheelNum == 'undefined') {
            wheelNum = 8;//默认8格
        }
        var thisIndex = wheelNum - index*1;//因为是顺时针旋转,所以要用 wheelNum-index
        minRot = minRot*1;
        var numRot = ( typeof ($wheel.data('numRot'))=='undefined' ? 0 : $wheel.data('numRot') );//转动次数,用于计算累积 基础转动值
        var totalAngles = probability( thisIndex , minRot , numRot , wheelNum );
        var runAngles = 'rotate('+ totalAngles +'deg'+')';
        var translateValue = 'translateZ(0)';//开启硬件加速
        var transformValue = runAngles+" "+translateValue;
        
        $wheel.css('-o-transform',transformValue);           //Opera
        $wheel.css('-ms-transform',transformValue);          //IE浏览器
        $wheel.css('-moz-transform',transformValue);         //Firefox
        $wheel.css('-webkit-transform',transformValue);      //Chrome和Safari
        $wheel.css('transform',transformValue);

        $wheel.data('numRot',(++numRot));//转动次数+1
        /*转动结束,回调事件注册*/
        // transitionEnd( $wheel.get(0) , runEnd_callback );
        transitionEnd( $wheel , runEnd_callback );
    }
    /**
     * [transition执行结束事件]
     * @param  {[原生dom元素]}   ele      [obj]
     * @param  {Function} callback [transition执行结束后的回调函数]
     */
    function transitionEnd( ele , callback ){

        ele.off('mozTransitionEnd oTransitionEnd webkitTransitionEnd transitionend').on('mozTransitionEnd oTransitionEnd webkitTransitionEnd transitionend', function(event) {
            callback();
        });

    }

    /**
     * [各奖项对应的旋转角度]
     * @param  {[number]} thisIndex  [旋转后,指针的指向的位置thisIndex]
     * @param  {[number]} minRot [至少转多少圈,用于计算基础转动值]
     * @param  {[number]} numRot [转动次数,用于计算累加转动角度]
     * @param  {[number]} wheelNum [转盘格数,默认为8]
     * @return {[number]}        [转动角度]
     */
    function probability( thisIndex, minRot , numRot ,wheelNum){
        //转盘每一格的度数 = 360 / wheelNum;
        // 基础转动值 = 360 * minRot
        // 转动偏移量 = thisIndex * _oneGridAngles
        var _totalAngles = 0;
        var _oneGridAngles = 360 / wheelNum; //转盘每一格的度数,如果是8格的转盘,则一格为45度
        var _lastAngles = numRot * ( minRot * 360 );//累加的基础转动值(不包含"转动偏移量"")
        var _thisAngles = 360 * minRot + thisIndex * _oneGridAngles;//本次转动的值( 基础转动值 + 转动偏移量 )
        _totalAngles = (360 * minRot + thisIndex * _oneGridAngles) + _lastAngles;//总值
        if (_totalAngles==0) {
            console.error( 'error: probability 计算的度数为0' );
        }
        return _totalAngles;
    }

    port.run = run;

    return port;
})

/*
示例css

#runWheel{
    background: url(../../../images/base/wheel/wheel-inside.png) no-repeat center center;
    background-size: 100% 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    height: 6.666667rem;
    width: 6.666667rem;
    margin-top: -3.33333333rem;
    margin-left: -3.33333333rem;
    border-radius: 100%;
    -o-transition: transform 6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    -ms-transition: transform 6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    -moz-transition: transform 6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    -webkit-transition: transform 6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transition: transform 6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    -o-transform-origin: 50% 50%;
    -ms-transform-origin: 50% 50%;
    -moz-transform-origin: 50% 50%;
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -webkit-transform: rotate(0deg) translateZ(0);
    transform: rotate(0deg) translateZ(0);
}

 */