define(['app','template','smExtend','footer','wxpay','dialog'],function(app,template,smExtend,footer,wxpay,dialog){
    var exportsObj = {};
    var deal_id = '';//商品ID
    var goodId = '';
    var openId = '';
    var userId = "";
    var orderId = "";
    exportsObj.init = function(request){
      app.setPageTitle("确认信息");
      footer.init($('#lifeFooterBar'));//初始化页脚
      orderId = request.orderId;
      openId = request.openId;
    //   wxpay.init(openId,orderId,wxpayInit_callback,'../confirm/paySuccess.html');//初始化微信支付
      getMyGoodData();
      getUser();
      $.refreshScroller();//更新js滚动条
    }

    function wxpayInit_callback(payData){
        $('#orderId').html( payData.orderId );//订单号
        $('#createTime').html( payData.orderTime );//生成订单时间
        $('#goodCount').html( "x"+payData.count );//数量
        $('#payMoney').html( app.format_money(payData.total_fee) );//实付金额
        goodId = payData.goodId;
        getMyGoodData();
    }

    function getUser(){
      $.ajax({
        url: app.url.getUser,
        type: 'POST',
        success:function(data){
          var data = app.toJson(data);
          console.log( 'getUser' , data );
          if(data.code==0){
            userId = data.data.user[0].USERID;
            app.setUserObj(data.data.user[0]);
          }else if(data.code==10000||data.code==-1){
            app.removeUserObj();
          }else{
            $.toast(data.message);
            app.removeUserObj();
          }
        }
      })
    }

    //支付点击按钮
    $(document).off('click','#pay').on('click','#pay',function () {
        if (app.isLogin()) {
            pay();
        }else{
            dialog.showLoginDialog();
        }
    });
    function pay(){
        $.showPreloader("跳转支付中...");//loding
        
        if(userId==""){
        	userId = app.getUserObj().USERID;
        }
    	// wxpay.surePay( userId );
        setTimeout(function(){
            $.hidePreloader();
            $.toast("模拟支付成功");
            $.router.load("../confirm/paySuccess.html",true);
        },1000);
    }
   //获取商品信息
    function getMyGoodData(){
        $.ajax({
            type: "POST",
            url: app.url.getGdshGoodsDetail,
            data: {
            	goodId : goodId
            },
            success: function (data) {
                var data = app.toJson(data);
                console.log("getGoodData",data);
                if(data.code==0){
                    var goodData = data.data.gdshGood.result.deal;
                    goodData.gdshPrice_yuan = app.format_money(goodData.gdshPrice);//转成元
                    //小商品图
                    $('.goodImgBox>img').attr('src', goodData.tiny_image);
                    
                    //商品名称
                    $('#goodsText').html(goodData.description);

                    //商品单价
                    $('#goodPrice').html(goodData.gdshPrice_yuan);

                }
            },
            complete : function(){
                //离线
                var data = {"errorCode":"200","errorMsg":"","result":{"errno":0,"msg":"success","deal":{"deal_id":5050721,"city_ids":[100010000],"title":"歌华开元大酒店江南华庭中餐","min_title":"歌华开元大酒店家宴","description":"家宴9人餐！节假日通用，需提前1天预约，提供免费WiFi，可使用包间，免费停车，免费WiFi！","long_title":"仅售1080元，价值1647元家宴9人餐！节假日通用，需提前1天预约，提供免费WiFi、停车位，可使用包间，免费停车，免费WiFi，需预约！","publish_time":1442505600,"purchase_deadline":1483199999,"coupon_start_time":1442505600,"coupon_end_time":1483286399,"cat_id":326,"subcat_ids":[424,962],"market_price":164700,"current_price":108000,"promotion_price":108000,"sale_num":11,"is_reservation_required":false,"person_upper":30,"person_lower":1,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=54f13b7274d4b2ac2a6e666ff4784013&src=http://e.hiphotos.baidu.com/bainuo/crop=0,8,800,484;w=720;q=80/sign=6516fa6acefcc3cea08f9373af75fab0/64380cd7912397dd8342ee4c5f82b2b7d0a287ba.jpg","mid_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=7da4f399fb3f0eb1ec2205e2bc5941fd&src=http://e.hiphotos.baidu.com/bainuo/wh=216,166/sign=f8537502dcb44aed591bb6e6822aab30/bba1cd11728b4710c7598b84c5cec3fdfc032307.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=8dadf6a9f687c7eda1dd3b179fc5a007&src=http://e.hiphotos.baidu.com/bainuo/crop=0,8,800,484;w=230;q=80/sign=9b148b84c5cec3fd9f71fd35ebb8f807/64380cd7912397dd8342ee4c5f82b2b7d0a287ba.jpg","deal_url":"https://www.nuomi.com/deal/u6kj3bf6.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=u6kj3bf6","buy_contents":"<br /><strong>-歌华开元大酒店家宴9人餐<\/strong><br /><strong>-凉菜:<\/strong><br />&nbsp;芥兰丝拌鹅掌筋(1份,价值38元)<br />&nbsp;绍兴醉鱼干(1份,价值32元)<br />&nbsp;特色酱黄瓜(1份,价值22元)<br />&nbsp;盐焗鸡(1份,价值32元)<br />&nbsp;梅菜笋丝(1份,价值18元)<br />&nbsp;酸辣黑木耳(1份,价值26元)<br /><strong>-热菜:<\/strong><br />&nbsp;土豆焖鲜鲍(1份,价值228元)<br />&nbsp;文火牛肋条(1份,价值158元)<br />&nbsp;笋干菜基围虾(1份,价值98元)<br />&nbsp;砂锅斑竹寿星鸡(1份,价值178元)<br />&nbsp;粉丝蒸扇贝(1份,价值108元)<br />&nbsp;金汤杂粮烩花胶(1份,价值158元)<br />&nbsp;现椒多宝鱼（1.7斤）(1份,价值180元)<br />&nbsp;泡藕尖炒甜豆(1份,价值68元)<br />&nbsp;笋干炖自磨豆腐(1份,价值58元)<br />&nbsp;白灼芥兰(1份,价值38元)<br /><strong>-主食，水果:<\/strong><br />&nbsp;米饭(9份,价值45元)<br />&nbsp;菜汁鲜菌包(1份,价值72元)<br />&nbsp;餐前水果(1份,价值90元)<br />","buy_contents_json":{"group_name":"套餐","ext_info":[""],"group_content":[{"group_name":"歌华开元大酒店家宴9人餐","group_content":[{"group_name":"凉菜","group_content":[{"fuwu_name":"芥兰丝拌鹅掌筋","fuwu_count":1000,"measurement":"份","price":38000},{"fuwu_name":"绍兴醉鱼干","fuwu_count":1000,"measurement":"份","price":32000},{"fuwu_name":"特色酱黄瓜","fuwu_count":1000,"measurement":"份","price":22000},{"fuwu_name":"盐焗鸡","fuwu_count":1000,"measurement":"份","price":32000},{"fuwu_name":"梅菜笋丝","fuwu_count":1000,"measurement":"份","price":18000},{"fuwu_name":"酸辣黑木耳","fuwu_count":1000,"measurement":"份","price":26000}],"level":1,"total_count":6,"select_count":6,"can_repeat":2},{"group_name":"热菜","group_content":[{"fuwu_name":"土豆焖鲜鲍","fuwu_count":1000,"measurement":"份","price":228000},{"fuwu_name":"文火牛肋条","fuwu_count":1000,"measurement":"份","price":158000},{"fuwu_name":"笋干菜基围虾","fuwu_count":1000,"measurement":"份","price":98000},{"fuwu_name":"砂锅斑竹寿星鸡","fuwu_count":1000,"measurement":"份","price":178000},{"fuwu_name":"粉丝蒸扇贝","fuwu_count":1000,"measurement":"份","price":108000},{"fuwu_name":"金汤杂粮烩花胶","fuwu_count":1000,"measurement":"份","price":158000},{"fuwu_name":"现椒多宝鱼（1.7斤）","fuwu_count":1000,"measurement":"份","price":180000},{"fuwu_name":"泡藕尖炒甜豆","fuwu_count":1000,"measurement":"份","price":68000},{"fuwu_name":"笋干炖自磨豆腐","fuwu_count":1000,"measurement":"份","price":58000},{"fuwu_name":"白灼芥兰","fuwu_count":1000,"measurement":"份","price":38000}],"level":1,"total_count":10,"select_count":10,"can_repeat":2},{"group_name":"主食，水果","group_content":[{"fuwu_name":"米饭","fuwu_count":9000,"measurement":"份","price":45000},{"fuwu_name":"菜汁鲜菌包","fuwu_count":1000,"measurement":"份","price":72000},{"fuwu_name":"餐前水果","fuwu_count":1000,"measurement":"份","price":90000}],"level":1,"total_count":3,"select_count":3,"can_repeat":2}],"level":2}],"level":3},"consumer_tips":"<ul><b>糯米券有效期:&nbsp;<\/b>2015年09月18日至2017年01月01日<br/><b>接待日期限制:&nbsp;<\/b>如下指定日期2016-02-07到2016-02-09不可使用<br/><b>接待时间:&nbsp;<\/b>10:30 - 14:00<br/><b>预约提醒:&nbsp;<\/b>请至少提前1天预约<br/><b>预约保留:&nbsp;<\/b>预约位逾期不保留，请准时<br/><b>其他优惠:&nbsp;<\/b>团购用户暂不享受店内其他优惠<br/><b>停车位收费标准:&nbsp;<\/b>提供免费停车位<br/><b>店内网络:&nbsp;<\/b>提供免费WiFi<br/><li style=\"list-style: square outside none;margin-left:15px\">每张糯米券不限使用人数<\/li><li style=\"list-style: square outside none;margin-left:15px\">每次消费不限使用糯米券张数，可叠加使用<\/li><li style=\"list-style: square outside none;margin-left:15px\">本单仅限堂食，不可外带<\/li><li style=\"list-style: square outside none;margin-left:15px\">商家不提供餐后打包服务<\/li><li style=\"list-style: square outside none;margin-left:15px\">本单大厅包间均可使用<\/li><li style=\"list-style: square outside none;margin-left:15px\">最多可预订2桌<\/li><li style=\"list-style: square outside none;margin-left:15px\">仅限于酒店华庭包厢使用<\/li><li style=\"list-style: square outside none;margin-left:15px\">预订电话：010-62028888-6722<\/li><li style=\"list-style: square outside none;margin-left:15px\">温馨提示<\/li><li style=\"list-style: square outside none;margin-left:15px\">团购用户不可同时享受商家其他优惠。酒水饮料等问题，请致电商家咨询，以商家反馈为准。如部分菜品因时令或其他不可抗因素导致无法提供，店内会用等价菜品替换，具体事宜请与店内协商。<\/li><\/ul>","consumer_tips_json":[{"id":"comptickettime","name":"糯米券有效期","show":"2015年09月18日至2017年01月01日"},{"id":"compreceptiondatelimit","name":"接待日期限制","show":"如下指定日期2016-02-07到2016-02-09不可使用"},{"id":"compreceptiontime","name":"接待时间","show":"10:30 - 14:00"},{"id":"compneedreserve","name":"预约提醒","show":"请至少提前1天预约"},{"id":"compoverduereserve","name":"预约保留","show":"预约位逾期不保留，请准时"},{"id":"compotherpreferential","name":"其他优惠","show":"团购用户暂不享受店内其他优惠"},{"id":"compparkfee","name":"停车位收费标准","show":"提供免费停车位"},{"id":"compstorenetwork","name":"店内网络","show":"提供免费WiFi"},{"id":"compersionlimit","name":"每张糯米券是否限制使用人数","show":"每张糯米券不限使用人数"},{"id":"comnuomivoucherlimit","name":"每次消费是否限用糯米券","show":"每次消费不限使用糯米券张数，可叠加使用"},{"id":"comfeedtakeout","name":"堂食外带约定","show":"本单仅限堂食，不可外带"},{"id":"comaftermealpackage","name":"是否餐后打包","show":"商家不提供餐后打包服务"},{"id":"comprivaterooms","name":"包间信息","show":"本单大厅包间均可使用"},{"id":"compsupplyment","name":"补充说明","show":"最多可预订2桌\r\n仅限于酒店华庭包厢使用\r\n预订电话：010-62028888-6722\r\n温馨提示\r\n团购用户不可同时享受商家其他优惠。酒水饮料等问题，请致电商家咨询，以商家反馈为准。如部分菜品因时令或其他不可抗因素导致无法提供，店内会用等价菜品替换，具体事宜请与店内协商。"}],"consumer_tips_constructed":[{"tips_id":"comptickettime","tips_name":"糯米券有效期","tips_contents":"2015年09月18日至2017年01月01日"},{"tips_id":"compreceptiondatelimit","tips_name":"接待日期限制","tips_contents":"如下指定日期2016-02-07到2016-02-09不可使用"},{"tips_id":"compreceptiontime","tips_name":"接待时间","tips_contents":"10:30 - 14:00"},{"tips_id":"compneedreserve","tips_name":"预约提醒","tips_contents":"请至少提前1天预约"},{"tips_id":"compoverduereserve","tips_name":"预约保留","tips_contents":"预约位逾期不保留，请准时"},{"tips_id":"compotherpreferential","tips_name":"其他优惠","tips_contents":"团购用户暂不享受店内其他优惠"},{"tips_id":"compparkfee","tips_name":"停车位收费标准","tips_contents":"提供免费停车位"},{"tips_id":"compstorenetwork","tips_name":"店内网络","tips_contents":"提供免费WiFi"},{"tips_id":"compersionlimit","tips_name":"每张糯米券是否限制使用人数","tips_contents":"每张糯米券不限使用人数"},{"tips_id":"comnuomivoucherlimit","tips_name":"每次消费是否限用糯米券","tips_contents":"每次消费不限使用糯米券张数，可叠加使用"},{"tips_id":"comfeedtakeout","tips_name":"堂食外带约定","tips_contents":"本单仅限堂食，不可外带"},{"tips_id":"comaftermealpackage","tips_name":"是否餐后打包","tips_contents":"商家不提供餐后打包服务"},{"tips_id":"comprivaterooms","tips_name":"包间信息","tips_contents":"本单大厅包间均可使用"},{"tips_id":"compsupplyment","tips_name":"补充说明","tips_contents":"最多可预订2桌\r\n仅限于酒店华庭包厢使用\r\n预订电话：010-62028888-6722\r\n温馨提示\r\n团购用户不可同时享受商家其他优惠。酒水饮料等问题，请致电商家咨询，以商家反馈为准。如部分菜品因时令或其他不可抗因素导致无法提供，店内会用等价菜品替换，具体事宜请与店内协商。"}],"is_structed":true,"buy_details":"芥兰丝拌鹅掌筋:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=2b9c2fd7625aaa8367a11ea56aa0f30a&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,572;w=470;q=99;c=nuomi,95,95/sign=3e9874f8cd95d143ce39be634ec0ae32/622762d0f703918fdcd3a531543d269758eec4cf.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>绍兴醉鱼干:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=70e3d6f40664fdd6e60c91c5929e109f&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,572;w=470;q=99;c=nuomi,95,95/sign=598111f5b43533fae1f9c96e95e3d12f/83025aafa40f4bfbbbb406af064f78f0f63618e0.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>特色酱黄瓜:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=234f81cbaf4d7386df0d838b96e92e24&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,572;w=470;q=99;c=nuomi,95,95/sign=39a224359c25bc313f125bd863efa181/38dbb6fd5266d0161d736fd3922bd40734fa35e6.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>酸辣黑木耳:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=ea0167dcaff045984d8f2ab1778eb608&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,572;w=470;q=99;c=nuomi,95,95/sign=53385f1fb61c8701c2f9e8a61a4fb21f/2934349b033b5bb5b4a1c10533d3d539b700bcd3.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>土豆焖鲜鲍:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=b23f207efc932069e9409165c45750cf&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,800,500;w=690;q=99;c=nuomi,95,95/sign=8603b56b652762d09471feff9ddc24ca/0df431adcbef760964d993d728dda3cc7dd99ea3.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>文火牛肋条:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=d427fee3a71286dcebd613c1930a8c49&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,800,1000;w=690;q=99;c=nuomi,95,95/sign=047844f198510fb36c562dd7e403e4a5/0bd162d9f2d3572cf36a96948c13632763d0c3ea.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>笋干菜基围虾:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=36173680dc58c8be57632be5303923a9&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,800,500;w=690;q=99;c=nuomi,95,95/sign=3fb5ef33d71373f0e17035df993f67cb/58ee3d6d55fbb2fbade02f5a494a20a44723dcab.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>砂锅斑竹寿星鸡:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=6519c115e66bcc3f87e6cf16c04db713&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,572;w=470;q=99;c=nuomi,95,95/sign=a63ae1780a2442a7ba41a7e5ec73817b/10dfa9ec8a1363275abb19c8948fa0ec09fac7f3.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>粉丝蒸扇贝:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=bf680f1ae25543ea0e735816d36e7b5c&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,628;w=470;q=99;c=nuomi,95,95/sign=594ef1fbec24b899ca732378533631a5/11385343fbf2b211e2655eb5cf8065380dd78e86.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>金汤杂粮烩花胶:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=c0dfb38a04da278604b9de5f0af39b29&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,628;w=470;q=99;c=nuomi,95,95/sign=cf019ce94a4a20a425516687ad62b412/7aec54e736d12f2e352f6a9b4ac2d56285356827.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>现椒多宝鱼（1.7斤）:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=5a28d6718293d9ab397abf38af105f17&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,800,500;w=690;q=99;c=nuomi,95,95/sign=7000f269748b4710da60a78cfefeefcd/8718367adab44aede4d2b4acb51c8701a08bfbde.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>泡藕尖炒甜豆:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=902eac18d3d139fce5e1d3306c919baa&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,628;w=470;q=99;c=nuomi,95,95/sign=840456d5add3fd1f2246f87a0d7e092f/aec379310a55b319ed4b478e46a98226cefc179e.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>笋干炖自磨豆腐:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=f87ece9c498926c8e82521c7f55772fe&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,700,875;w=690;q=99;c=nuomi,95,95/sign=5dd487767dec54e755a3405e8408b760/c83d70cf3bc79f3d8437ee78bca1cd11738b29a7.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>白灼芥兰:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=466fa90a2b35fe4e6f6ef6cca2ce26c6&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,572;w=470;q=99;c=nuomi,95,95/sign=3d2005fdaac379316927dc69d6f49b75/4e4a20a4462309f7d5826ae9770e0cf3d6cad658.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>","shop_description":"<img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=41345dc024deae73e80739cfbd47ca6f&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,648,432;w=470;q=89;c=nuomi,95,95/sign=ce1a796a9a3df8dcb272d5d1f0215ebb/8b82b9014a90f603cd58ebda3c12b31bb151ed47.jpg\" style=\"float:none;display:block;\" title=\"图片\"/>北京歌华开元大酒店是按照国际五星级标准精心打造的中国首家文化传媒主题酒店，于2008年4月中旬开业，在北京奥运会期间被指定为2008北京国际新闻中心。酒店以其浓厚的传媒文化为底蕴，配以豪华完善的先进设施，为顾客提供具有国际品质并富有东方文化特色的优质服务。壹咖啡西餐厅位于酒店一层，共有127个餐位，是酒店重点推荐的餐厅。设有开放式的厨房，供应早，晚自助餐及24小时送餐服务。另有意大利及东南亚风味的零点美食供您选择，专注的服务和精致的美食，给您留下难忘的就餐体验。<br /><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=a655fcf36e52720d5987298d345b7f41&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,636,424;w=470;q=99;c=nuomi,95,95/sign=a2812e387ef0f736ccb1164137659f29/4e4a20a4462309f799b7b555740e0cf3d6cad698.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=6f8ad9415ad776fe25d91afa2778c4c8&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,800,1200;w=470;q=90;c=nuomi,95,95/sign=90479765cefcc3cea08f9373af75fab8/3812b31bb051f819514f180ddcb44aed2e73e70b.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=585f805bc3c25e3895784929b3754ee7&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,800,1200;w=470;q=90;c=nuomi,95,95/sign=ae6a8d9b0efa513d45e5369e005d79cb/b3b7d0a20cf431adf40a5b7e4d36acaf2fdd9898.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=52b5469b1167306433ec78b775337d3a&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,800,533;w=470;q=89;c=nuomi,95,95/sign=085894d6cb11728b2462d662f5cceffe/b151f8198618367a03ec649a28738bd4b31ce514.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=d8fbfe4bba6e1d5acd2b82aa52967911&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,156;w=470;q=99;c=nuomi,95,95/sign=af8917616b224f4a43d6295334c7bc62/77094b36acaf2eddbebe28ae8b1001e93901932d.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/>","shop_ids":[5308127],"refund_strategy_type":3,"update_time":1472666051,"status":1,"other_site_code":"0","is_option":"0"}},"success":true};
                data = app.toJson(data);
                if(data.success){
                    var goodData = data.result.deal;
                    console.log(goodData);
                    goodData.current_price_yuan = app.format_money(goodData.current_price);//转成元
                    goodData.market_price_yuan = app.format_money(goodData.market_price);//转成元

                    canSale = goodData.status;//商品是否可售

                    //商品图片
                    $('.goodImgBox>img').attr('src', goodData.tiny_image);
                    
                    //popup商品名称
                    $('#goodsText').html(goodData.description);

                    $('#goodPrice').html( goodData.current_price_yuan );

                }
                //离线
                $.refreshScroller();//更新js滚动条
            }
        });
    }

    return exportsObj;
})
