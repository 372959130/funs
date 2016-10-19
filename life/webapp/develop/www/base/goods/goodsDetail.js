define(['app','template','smExtend','footer'],function(app,template,smExtend,footer){
    var exportsObj = {};
    var deal_id = "";
    var shop_id = ""
    var canSale = 0;//该商品是否可售,根据糯米接口确定,0--不可售  1--可售
    var refund_strategy_type = {
      "1" : "7天内随时退",
      "2" : "过期退",
      "4" : "随便退",
      "0" : "不支持退款",
      "3" : "7天内随时退 过期退",
      "5" : "7天内随时退 随便退",
      "6" : "过期退 随便退",
      "7" : "7天内随时退 过期退 随便退",
    };//退款类型

    exportsObj.init = function(request){
      app.setPageTitle("美食");
      deal_id = request.deal_id;
      shop_id = request.shop_id;
      footer.init($('#lifeFooterBar'));//初始化页脚
      getGoodData();//获取商品信息
      getShopData();//获取店铺信息
      $.refreshScroller();//更新js滚动条
    }
    exportsObj.destroy = function(){
      $.closeModal();//关闭popup
    };

    //获取商品信息
    function getGoodData(){
        $.ajax({
            type: "POST",
            url: app.baseUrl_commcenter + "/nomi/dealDetail.do",
            data: {
                deal_id : deal_id
            },
            success: function (data) {
                var data = app.toJson(data);
                console.log(data);
                if(data.success){
                    var goodData = data.result.deal;
                    goodData.current_price_yuan = app.format_money(goodData.current_price);//转成元
                    goodData.market_price_yuan = app.format_money(goodData.market_price);//转成元

                    canSale = goodData.status;//商品是否可售

                    //商品图片
                    $('#goodImg').attr('src', goodData.image);

                    //popup小商品图
                    $('.popup-goodImg>img').attr('src', goodData.tiny_image);
                    
                    //popup商品名称
                    $('.popup-goodName').html(goodData.title);

                    //商品价格
                    var priceHtml = template('priceTpl',goodData);
                    $('.priceBox').html( priceHtml );//商品价格

                    //底部价格
                    var buyBoxHtml = template('buyBoxTpl',goodData);
                    $('.buyBox').html( buyBoxHtml );//商品价格

                    //popup价格
                    var popup_buyBoxTplHtml = template('popup_buyBoxTpl',goodData);
                    $('.popup-goodFooter .gDetailList-footer').html( popup_buyBoxTplHtml );//商品价格

                    //是否免预约
                    if (goodData.is_reservation_required) {
                      $('#reservation').addClass('myChecked');
                    }
                    //退款类型
                    $('#refund_strategy').addClass('myChecked').html( refund_strategy_type[goodData.refund_strategy_type] );

                    //购买内容
                    $('#buy_contents').html(goodData.buy_contents);

                    //温情提示
                    var goodsTipsHtml = template('goodsTipsTpl',goodData);
                    $('.goodsTips').html( goodsTipsHtml );

                    //图文详情
                    $('#pictureDetail>span').html( goodData.buy_details );

                    //初始化计数器
                    numInit( goodData.person_lower,goodData.person_upper , numCallback );
                }
            },
            complete : function(){
                //离线
                var data = {"errorCode":"200","errorMsg":"","result":{"errno":0,"msg":"success","deal":{"deal_id":5050721,"city_ids":[100010000],"title":"歌华开元大酒店江南华庭中餐","min_title":"歌华开元大酒店家宴","description":"家宴9人餐！节假日通用，需提前1天预约，提供免费WiFi，可使用包间，免费停车，免费WiFi！","long_title":"仅售1080元，价值1647元家宴9人餐！节假日通用，需提前1天预约，提供免费WiFi、停车位，可使用包间，免费停车，免费WiFi，需预约！","publish_time":1442505600,"purchase_deadline":1483199999,"coupon_start_time":1442505600,"coupon_end_time":1483286399,"cat_id":326,"subcat_ids":[424,962],"market_price":164700,"current_price":108000,"promotion_price":108000,"sale_num":11,"is_reservation_required":false,"person_upper":30,"person_lower":1,"image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=54f13b7274d4b2ac2a6e666ff4784013&src=http://e.hiphotos.baidu.com/bainuo/crop=0,8,800,484;w=720;q=80/sign=6516fa6acefcc3cea08f9373af75fab0/64380cd7912397dd8342ee4c5f82b2b7d0a287ba.jpg","mid_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=7da4f399fb3f0eb1ec2205e2bc5941fd&src=http://e.hiphotos.baidu.com/bainuo/wh=216,166/sign=f8537502dcb44aed591bb6e6822aab30/bba1cd11728b4710c7598b84c5cec3fdfc032307.jpg","tiny_image":"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=8dadf6a9f687c7eda1dd3b179fc5a007&src=http://e.hiphotos.baidu.com/bainuo/crop=0,8,800,484;w=230;q=80/sign=9b148b84c5cec3fd9f71fd35ebb8f807/64380cd7912397dd8342ee4c5f82b2b7d0a287ba.jpg","deal_url":"https://www.nuomi.com/deal/u6kj3bf6.html","deal_murl":"https://m.nuomi.com/deal/view?tinyurl=u6kj3bf6","buy_contents":"<br /><strong>-歌华开元大酒店家宴9人餐<\/strong><br /><strong>-凉菜:<\/strong><br />&nbsp;芥兰丝拌鹅掌筋(1份,价值38元)<br />&nbsp;绍兴醉鱼干(1份,价值32元)<br />&nbsp;特色酱黄瓜(1份,价值22元)<br />&nbsp;盐焗鸡(1份,价值32元)<br />&nbsp;梅菜笋丝(1份,价值18元)<br />&nbsp;酸辣黑木耳(1份,价值26元)<br /><strong>-热菜:<\/strong><br />&nbsp;土豆焖鲜鲍(1份,价值228元)<br />&nbsp;文火牛肋条(1份,价值158元)<br />&nbsp;笋干菜基围虾(1份,价值98元)<br />&nbsp;砂锅斑竹寿星鸡(1份,价值178元)<br />&nbsp;粉丝蒸扇贝(1份,价值108元)<br />&nbsp;金汤杂粮烩花胶(1份,价值158元)<br />&nbsp;现椒多宝鱼（1.7斤）(1份,价值180元)<br />&nbsp;泡藕尖炒甜豆(1份,价值68元)<br />&nbsp;笋干炖自磨豆腐(1份,价值58元)<br />&nbsp;白灼芥兰(1份,价值38元)<br /><strong>-主食，水果:<\/strong><br />&nbsp;米饭(9份,价值45元)<br />&nbsp;菜汁鲜菌包(1份,价值72元)<br />&nbsp;餐前水果(1份,价值90元)<br />","buy_contents_json":{"group_name":"套餐","ext_info":[""],"group_content":[{"group_name":"歌华开元大酒店家宴9人餐","group_content":[{"group_name":"凉菜","group_content":[{"fuwu_name":"芥兰丝拌鹅掌筋","fuwu_count":1000,"measurement":"份","price":38000},{"fuwu_name":"绍兴醉鱼干","fuwu_count":1000,"measurement":"份","price":32000},{"fuwu_name":"特色酱黄瓜","fuwu_count":1000,"measurement":"份","price":22000},{"fuwu_name":"盐焗鸡","fuwu_count":1000,"measurement":"份","price":32000},{"fuwu_name":"梅菜笋丝","fuwu_count":1000,"measurement":"份","price":18000},{"fuwu_name":"酸辣黑木耳","fuwu_count":1000,"measurement":"份","price":26000}],"level":1,"total_count":6,"select_count":6,"can_repeat":2},{"group_name":"热菜","group_content":[{"fuwu_name":"土豆焖鲜鲍","fuwu_count":1000,"measurement":"份","price":228000},{"fuwu_name":"文火牛肋条","fuwu_count":1000,"measurement":"份","price":158000},{"fuwu_name":"笋干菜基围虾","fuwu_count":1000,"measurement":"份","price":98000},{"fuwu_name":"砂锅斑竹寿星鸡","fuwu_count":1000,"measurement":"份","price":178000},{"fuwu_name":"粉丝蒸扇贝","fuwu_count":1000,"measurement":"份","price":108000},{"fuwu_name":"金汤杂粮烩花胶","fuwu_count":1000,"measurement":"份","price":158000},{"fuwu_name":"现椒多宝鱼（1.7斤）","fuwu_count":1000,"measurement":"份","price":180000},{"fuwu_name":"泡藕尖炒甜豆","fuwu_count":1000,"measurement":"份","price":68000},{"fuwu_name":"笋干炖自磨豆腐","fuwu_count":1000,"measurement":"份","price":58000},{"fuwu_name":"白灼芥兰","fuwu_count":1000,"measurement":"份","price":38000}],"level":1,"total_count":10,"select_count":10,"can_repeat":2},{"group_name":"主食，水果","group_content":[{"fuwu_name":"米饭","fuwu_count":9000,"measurement":"份","price":45000},{"fuwu_name":"菜汁鲜菌包","fuwu_count":1000,"measurement":"份","price":72000},{"fuwu_name":"餐前水果","fuwu_count":1000,"measurement":"份","price":90000}],"level":1,"total_count":3,"select_count":3,"can_repeat":2}],"level":2}],"level":3},"consumer_tips":"<ul><b>糯米券有效期:&nbsp;<\/b>2015年09月18日至2017年01月01日<br/><b>接待日期限制:&nbsp;<\/b>如下指定日期2016-02-07到2016-02-09不可使用<br/><b>接待时间:&nbsp;<\/b>10:30 - 14:00<br/><b>预约提醒:&nbsp;<\/b>请至少提前1天预约<br/><b>预约保留:&nbsp;<\/b>预约位逾期不保留，请准时<br/><b>其他优惠:&nbsp;<\/b>团购用户暂不享受店内其他优惠<br/><b>停车位收费标准:&nbsp;<\/b>提供免费停车位<br/><b>店内网络:&nbsp;<\/b>提供免费WiFi<br/><li style=\"list-style: square outside none;margin-left:15px\">每张糯米券不限使用人数<\/li><li style=\"list-style: square outside none;margin-left:15px\">每次消费不限使用糯米券张数，可叠加使用<\/li><li style=\"list-style: square outside none;margin-left:15px\">本单仅限堂食，不可外带<\/li><li style=\"list-style: square outside none;margin-left:15px\">商家不提供餐后打包服务<\/li><li style=\"list-style: square outside none;margin-left:15px\">本单大厅包间均可使用<\/li><li style=\"list-style: square outside none;margin-left:15px\">最多可预订2桌<\/li><li style=\"list-style: square outside none;margin-left:15px\">仅限于酒店华庭包厢使用<\/li><li style=\"list-style: square outside none;margin-left:15px\">预订电话：010-62028888-6722<\/li><li style=\"list-style: square outside none;margin-left:15px\">温馨提示<\/li><li style=\"list-style: square outside none;margin-left:15px\">团购用户不可同时享受商家其他优惠。酒水饮料等问题，请致电商家咨询，以商家反馈为准。如部分菜品因时令或其他不可抗因素导致无法提供，店内会用等价菜品替换，具体事宜请与店内协商。<\/li><\/ul>","consumer_tips_json":[{"id":"comptickettime","name":"糯米券有效期","show":"2015年09月18日至2017年01月01日"},{"id":"compreceptiondatelimit","name":"接待日期限制","show":"如下指定日期2016-02-07到2016-02-09不可使用"},{"id":"compreceptiontime","name":"接待时间","show":"10:30 - 14:00"},{"id":"compneedreserve","name":"预约提醒","show":"请至少提前1天预约"},{"id":"compoverduereserve","name":"预约保留","show":"预约位逾期不保留，请准时"},{"id":"compotherpreferential","name":"其他优惠","show":"团购用户暂不享受店内其他优惠"},{"id":"compparkfee","name":"停车位收费标准","show":"提供免费停车位"},{"id":"compstorenetwork","name":"店内网络","show":"提供免费WiFi"},{"id":"compersionlimit","name":"每张糯米券是否限制使用人数","show":"每张糯米券不限使用人数"},{"id":"comnuomivoucherlimit","name":"每次消费是否限用糯米券","show":"每次消费不限使用糯米券张数，可叠加使用"},{"id":"comfeedtakeout","name":"堂食外带约定","show":"本单仅限堂食，不可外带"},{"id":"comaftermealpackage","name":"是否餐后打包","show":"商家不提供餐后打包服务"},{"id":"comprivaterooms","name":"包间信息","show":"本单大厅包间均可使用"},{"id":"compsupplyment","name":"补充说明","show":"最多可预订2桌\r\n仅限于酒店华庭包厢使用\r\n预订电话：010-62028888-6722\r\n温馨提示\r\n团购用户不可同时享受商家其他优惠。酒水饮料等问题，请致电商家咨询，以商家反馈为准。如部分菜品因时令或其他不可抗因素导致无法提供，店内会用等价菜品替换，具体事宜请与店内协商。"}],"consumer_tips_constructed":[{"tips_id":"comptickettime","tips_name":"糯米券有效期","tips_contents":"2015年09月18日至2017年01月01日"},{"tips_id":"compreceptiondatelimit","tips_name":"接待日期限制","tips_contents":"如下指定日期2016-02-07到2016-02-09不可使用"},{"tips_id":"compreceptiontime","tips_name":"接待时间","tips_contents":"10:30 - 14:00"},{"tips_id":"compneedreserve","tips_name":"预约提醒","tips_contents":"请至少提前1天预约"},{"tips_id":"compoverduereserve","tips_name":"预约保留","tips_contents":"预约位逾期不保留，请准时"},{"tips_id":"compotherpreferential","tips_name":"其他优惠","tips_contents":"团购用户暂不享受店内其他优惠"},{"tips_id":"compparkfee","tips_name":"停车位收费标准","tips_contents":"提供免费停车位"},{"tips_id":"compstorenetwork","tips_name":"店内网络","tips_contents":"提供免费WiFi"},{"tips_id":"compersionlimit","tips_name":"每张糯米券是否限制使用人数","tips_contents":"每张糯米券不限使用人数"},{"tips_id":"comnuomivoucherlimit","tips_name":"每次消费是否限用糯米券","tips_contents":"每次消费不限使用糯米券张数，可叠加使用"},{"tips_id":"comfeedtakeout","tips_name":"堂食外带约定","tips_contents":"本单仅限堂食，不可外带"},{"tips_id":"comaftermealpackage","tips_name":"是否餐后打包","tips_contents":"商家不提供餐后打包服务"},{"tips_id":"comprivaterooms","tips_name":"包间信息","tips_contents":"本单大厅包间均可使用"},{"tips_id":"compsupplyment","tips_name":"补充说明","tips_contents":"最多可预订2桌\r\n仅限于酒店华庭包厢使用\r\n预订电话：010-62028888-6722\r\n温馨提示\r\n团购用户不可同时享受商家其他优惠。酒水饮料等问题，请致电商家咨询，以商家反馈为准。如部分菜品因时令或其他不可抗因素导致无法提供，店内会用等价菜品替换，具体事宜请与店内协商。"}],"is_structed":true,"buy_details":"芥兰丝拌鹅掌筋:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=2b9c2fd7625aaa8367a11ea56aa0f30a&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,572;w=470;q=99;c=nuomi,95,95/sign=3e9874f8cd95d143ce39be634ec0ae32/622762d0f703918fdcd3a531543d269758eec4cf.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>绍兴醉鱼干:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=70e3d6f40664fdd6e60c91c5929e109f&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,572;w=470;q=99;c=nuomi,95,95/sign=598111f5b43533fae1f9c96e95e3d12f/83025aafa40f4bfbbbb406af064f78f0f63618e0.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>特色酱黄瓜:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=234f81cbaf4d7386df0d838b96e92e24&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,572;w=470;q=99;c=nuomi,95,95/sign=39a224359c25bc313f125bd863efa181/38dbb6fd5266d0161d736fd3922bd40734fa35e6.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>酸辣黑木耳:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=ea0167dcaff045984d8f2ab1778eb608&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,572;w=470;q=99;c=nuomi,95,95/sign=53385f1fb61c8701c2f9e8a61a4fb21f/2934349b033b5bb5b4a1c10533d3d539b700bcd3.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>土豆焖鲜鲍:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=b23f207efc932069e9409165c45750cf&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,800,500;w=690;q=99;c=nuomi,95,95/sign=8603b56b652762d09471feff9ddc24ca/0df431adcbef760964d993d728dda3cc7dd99ea3.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>文火牛肋条:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=d427fee3a71286dcebd613c1930a8c49&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,800,1000;w=690;q=99;c=nuomi,95,95/sign=047844f198510fb36c562dd7e403e4a5/0bd162d9f2d3572cf36a96948c13632763d0c3ea.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>笋干菜基围虾:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=36173680dc58c8be57632be5303923a9&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,800,500;w=690;q=99;c=nuomi,95,95/sign=3fb5ef33d71373f0e17035df993f67cb/58ee3d6d55fbb2fbade02f5a494a20a44723dcab.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>砂锅斑竹寿星鸡:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=6519c115e66bcc3f87e6cf16c04db713&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,572;w=470;q=99;c=nuomi,95,95/sign=a63ae1780a2442a7ba41a7e5ec73817b/10dfa9ec8a1363275abb19c8948fa0ec09fac7f3.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>粉丝蒸扇贝:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=bf680f1ae25543ea0e735816d36e7b5c&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,628;w=470;q=99;c=nuomi,95,95/sign=594ef1fbec24b899ca732378533631a5/11385343fbf2b211e2655eb5cf8065380dd78e86.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>金汤杂粮烩花胶:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=c0dfb38a04da278604b9de5f0af39b29&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,628;w=470;q=99;c=nuomi,95,95/sign=cf019ce94a4a20a425516687ad62b412/7aec54e736d12f2e352f6a9b4ac2d56285356827.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>现椒多宝鱼（1.7斤）:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=5a28d6718293d9ab397abf38af105f17&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,800,500;w=690;q=99;c=nuomi,95,95/sign=7000f269748b4710da60a78cfefeefcd/8718367adab44aede4d2b4acb51c8701a08bfbde.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>泡藕尖炒甜豆:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=902eac18d3d139fce5e1d3306c919baa&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,628;w=470;q=99;c=nuomi,95,95/sign=840456d5add3fd1f2246f87a0d7e092f/aec379310a55b319ed4b478e46a98226cefc179e.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>笋干炖自磨豆腐:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=f87ece9c498926c8e82521c7f55772fe&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,700,875;w=690;q=99;c=nuomi,95,95/sign=5dd487767dec54e755a3405e8408b760/c83d70cf3bc79f3d8437ee78bca1cd11738b29a7.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>白灼芥兰:<br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=466fa90a2b35fe4e6f6ef6cca2ce26c6&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,600,572;w=470;q=99;c=nuomi,95,95/sign=3d2005fdaac379316927dc69d6f49b75/4e4a20a4462309f7d5826ae9770e0cf3d6cad658.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><br/>","shop_description":"<img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=41345dc024deae73e80739cfbd47ca6f&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,648,432;w=470;q=89;c=nuomi,95,95/sign=ce1a796a9a3df8dcb272d5d1f0215ebb/8b82b9014a90f603cd58ebda3c12b31bb151ed47.jpg\" style=\"float:none;display:block;\" title=\"图片\"/>北京歌华开元大酒店是按照国际五星级标准精心打造的中国首家文化传媒主题酒店，于2008年4月中旬开业，在北京奥运会期间被指定为2008北京国际新闻中心。酒店以其浓厚的传媒文化为底蕴，配以豪华完善的先进设施，为顾客提供具有国际品质并富有东方文化特色的优质服务。壹咖啡西餐厅位于酒店一层，共有127个餐位，是酒店重点推荐的餐厅。设有开放式的厨房，供应早，晚自助餐及24小时送餐服务。另有意大利及东南亚风味的零点美食供您选择，专注的服务和精致的美食，给您留下难忘的就餐体验。<br /><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=a655fcf36e52720d5987298d345b7f41&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,636,424;w=470;q=99;c=nuomi,95,95/sign=a2812e387ef0f736ccb1164137659f29/4e4a20a4462309f799b7b555740e0cf3d6cad698.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=6f8ad9415ad776fe25d91afa2778c4c8&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,800,1200;w=470;q=90;c=nuomi,95,95/sign=90479765cefcc3cea08f9373af75fab8/3812b31bb051f819514f180ddcb44aed2e73e70b.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=585f805bc3c25e3895784929b3754ee7&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,800,1200;w=470;q=90;c=nuomi,95,95/sign=ae6a8d9b0efa513d45e5369e005d79cb/b3b7d0a20cf431adf40a5b7e4d36acaf2fdd9898.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=52b5469b1167306433ec78b775337d3a&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,800,533;w=470;q=89;c=nuomi,95,95/sign=085894d6cb11728b2462d662f5cceffe/b151f8198618367a03ec649a28738bd4b31ce514.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/><img src = \"http://timg.baidu.com/timg?lbstsm&ref=http%3a%2f%2fbj.nuomi.com&quality=100&size=8&sec=1475034282&di=d8fbfe4bba6e1d5acd2b82aa52967911&src=http://e.hiphotos.baidu.com/bainuo/crop=0,0,470,156;w=470;q=99;c=nuomi,95,95/sign=af8917616b224f4a43d6295334c7bc62/77094b36acaf2eddbebe28ae8b1001e93901932d.jpg\" style=\"float:none;display:block;\" title=\"图片\"/><br/>","shop_ids":[5308127],"refund_strategy_type":3,"update_time":1472666051,"status":1,"other_site_code":"0","is_option":"0"}},"success":true};
                data = app.toJson(data);
                if(data.success){
                    var goodData = data.result.deal;
                    goodData.current_price_yuan = app.format_money(goodData.current_price);//转成元
                    goodData.market_price_yuan = app.format_money(goodData.market_price);//转成元

                    canSale = goodData.status;//商品是否可售

                    //商品图片
                    $('#goodImg').attr('src', goodData.image);

                    //popup小商品图
                    $('.popup-goodImg>img').attr('src', goodData.tiny_image);
                    
                    //popup商品名称
                    $('.popup-goodName').html(goodData.title);

                    //商品价格
                    var priceHtml = template('priceTpl',goodData);
                    $('.priceBox').html( priceHtml );//商品价格

                    //底部价格
                    var buyBoxHtml = template('buyBoxTpl',goodData);
                    $('.buyBox').html( buyBoxHtml );//商品价格

                    //popup价格
                    var popup_buyBoxTplHtml = template('popup_buyBoxTpl',goodData);
                    $('.popup-goodFooter .gDetailList-footer').html( popup_buyBoxTplHtml );//商品价格

                    //是否免预约
                    if (goodData.is_reservation_required) {
                      $('#reservation').addClass('myChecked');
                    }
                    //退款类型
                    $('#refund_strategy').addClass('myChecked').html( refund_strategy_type[goodData.refund_strategy_type] );

                    //购买内容
                    $('#buy_contents').html(goodData.buy_contents);

                    //温情提示
                    var goodsTipsHtml = template('goodsTipsTpl',goodData);
                    $('.goodsTips').html( goodsTipsHtml );

                    //图文详情
                    $('#pictureDetail>span').html( goodData.buy_details );

                    //初始化计数器
                    numInit( goodData.person_lower,goodData.person_upper , numCallback );
                }
                //离线
                $.refreshScroller();//更新js滚动条
            }
        });
    }

    //获取店铺信息
    function getShopData(){
        $.ajax({
            type: "POST",
            url: app.baseUrl_commcenter + "/nomi/getShopDetail.do",
            data: {
                shop_id : shop_id
            },
            success: function (data) {
                var data = app.toJson(data);
                console.log(data);
                if(data.success){
                    var shopData = data.result.shop;
                    //商品价格
                    var shopLocationHtml = template('shopLocationTpl',shopData);
                    $('#shopLocationBox').html( shopLocationHtml );//商品价格
                }
            },
            complete : function(){
                //离线
                var data = {"errorCode":"200","errorMsg":"","result":{"errno":0,"msg":"success","shop":{"shop_id":5308127,"city_id":100010000,"shop_name":"歌华开元大酒店江南中餐厅","shop_url":"https://www.nuomi.com/shop/5308127","shop_murl":"https://m.nuomi.com/merchant/5308127","address":"北京市朝阳区鼓楼外大街19号歌华开元大酒店1楼(安华桥南)","district_id":307,"bizarea_id":"1316","bizarea_name":"安贞","phone":"01062028888|01062028888转6722","open_time":"24小时营业通常酒店的入住时间为14:00，离店时间为正午12:00。","longitude":116.3942,"latitude":39.9652,"baidu_longitude":116.4003,"baidu_latitude":39.9713,"traffic_info":"","average_source":"4.5","average_price":"13800","introduction":"北京歌华开元大酒店位于北京市北三环的奥林匹克商务区内，地处城市中轴线北端，交通便利。酒店南侧为市中心，西侧为著名的科研文教区和历史风景名胜区，驾车到首都国际机场只需35分钟，到鸟巢只需5分钟，步行即可达奥林匹克公园。　　北京歌华开元大酒店以其浓厚的传媒文化为底蕴，配以豪华完善的先进设施，为您提供具有国际品质并富有东方文化特色的舒适服务，同时拥有SPA、足浴等，让您在休息之余，体验更多、更全面的舒适服务。","description":"","featured_menus":"盐水鸭,小黄鱼,鸭舌,乳鸽,杭州酱鸭,笋烧豆腐,水煮鱼,菌菇汤,黑胡椒牛仔骨,茶树菇炒猪颈肉,剁椒鱼头,红烧肉,宫保虾球,宫保鸡丁,雪菜南瓜面片汤,清蒸青石斑","featured_service":"有wifi,免费停车,可以刷卡,有包间","photo":[{"album_id":"10","album_name":"firstPhoto","album_description":"firstPhoto","photo_details":[{"photoTitle":"","url":"http://S0.nuomi.bdimg.com/upload/2014/04-25/1398429595150-7470.jpg","photoPrice":0}]},{"album_id":"11","album_name":"envPhotoList","album_description":"envPhotoList","photo_details":[{"photoTitle":"江南中餐厅.jpg","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/242dd42a2834349b29d07fc2cfea15ce37d3bea6.jpg","photoPrice":0},{"photoTitle":"大堂.jpg","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/4e4a20a4462309f799b7b555740e0cf3d6cad698.jpg","photoPrice":0},{"photoTitle":"470.jpg","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/caef76094b36acafc10b22b67ad98d1000e99c95.jpg","photoPrice":0},{"photoTitle":"大堂.jpg","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/dcc451da81cb39db02e57211d6160924ab18304b.jpg","photoPrice":0},{"photoTitle":"华庭包厢5.jpg","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/e850352ac65c1038b19c8288b4119313b17e899e.jpg","photoPrice":0},{"photoTitle":"华庭包厢4.jpg","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/3812b31bb051f819514f180ddcb44aed2e73e70b.jpg","photoPrice":0},{"photoTitle":"IMG_6566.JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/b151f8198618367a03ec649a28738bd4b31ce514.jpg","photoPrice":0},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C648%2C432%3Bw%3D470%3Bq%3D89%3Bc%3Dnuomi%2C95%2C95/sign=ce1a796a9a3df8dcb272d5d1f0215ebb/8b82b9014a90f603cd58ebda3c12b31bb151ed47.jpg","photoPrice":0},{"photoTitle":"江南中餐厅1.jpg","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/6a600c338744ebf83cd34e78dff9d72a6159a7d2.jpg","photoPrice":0},{"photoTitle":"500元添加（470）_副本.jpg","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/060828381f30e92429b92d7b4a086e061d95f75f.jpg","photoPrice":0}]},{"album_id":"12","album_name":"dishPhotoList","album_description":"dishPhotoList","photo_details":[{"photoTitle":"IMG_3155.JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/5d6034a85edf8db1af297de90f23dd54564e7433.jpg","photoPrice":138},{"photoTitle":"梅菜笋丝.JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/6159252dd42a2834e5b47f415db5c9ea15cebf6e.jpg","photoPrice":18},{"photoTitle":"IMG_3169.JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/d1160924ab18972b723d0147e0cd7b899e510a33.jpg","photoPrice":138},{"photoTitle":"炆火焖牛肋条_副本.jpg","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/08f790529822720eb1f1abb07dcb0a46f21fabb9.jpg","photoPrice":158},{"photoTitle":"IMG_3135.JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/6159252dd42a28342e8d30865db5c9ea15cebf17.jpg","photoPrice":138},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C600%2C628%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=65caf121ae64034f1b82984692f35501/21a4462309f79052b61378c209f3d7ca7bcbd539.jpg","photoPrice":0},{"photoTitle":"IMG_3205.JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/a8773912b31bb051290fb5a5307adab44aede010.jpg","photoPrice":138},{"photoTitle":"IMG_3170.JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/34fae6cd7b899e51a4893b9944a7d933c8950d33.jpg","photoPrice":138},{"photoTitle":"笋干菜基围虾 .JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/500fd9f9d72a6059eb29a8502e34349b033bbabb.jpg","photoPrice":98},{"photoTitle":"IMG_3145.JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/cb8065380cd79123a6cb92f9ab345982b2b78017.jpg","photoPrice":138},{"photoTitle":"IMG_3201.JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/b8014a90f603738d64610aafb51bb051f819ec10.jpg","photoPrice":138},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C600%2C572%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=86d8ec08b24543a9e154a08c2327a6b2/9922720e0cf3d7ca4e0a0d8af71fbe096a63a949.jpg","photoPrice":0},{"photoTitle":"IMG_6628.JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/b8389b504fc2d56282999ca7e11190ef77c66ce2.jpg","photoPrice":228},{"photoTitle":"IMG_3113.JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/10dfa9ec8a13632790c5c4be978fa0ec08fac717.jpg","photoPrice":138},{"photoTitle":"鲜椒多宝鱼.JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/8718367adab44aede4d2b4acb51c8701a08bfbde.jpg","photoPrice":180},{"photoTitle":"IMG_3158.JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/8d5494eef01f3a2970e3d3439f25bc315c607c17.jpg","photoPrice":138},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C600%2C628%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=38f29011a444ad343af0ddc7ed9220c4/a9d3fd1f4134970a999f22d390cad1c8a6865d59.jpg","photoPrice":0},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C600%2C628%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=b138ce30c6cec3fd9f71fd35ebb8f80f/2f738bd4b31c8701a9a1811a227f9e2f0708ff32.jpg","photoPrice":0},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C600%2C572%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=0629fecf948fa0ec6b883e4d1ba775de/b3b7d0a20cf431adaf167fc54e36acaf2fdd9801.jpg","photoPrice":0},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C500%2C477%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=778f8d49b7b7d0a26f865eddf6df5a39/838ba61ea8d3fd1f9b8f43c1354e251f94ca5f43.jpg","photoPrice":0},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C600%2C572%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=83bd22f3bd0e7bec379559a1121e9508/71cf3bc79f3df8dc6bbcb96dc811728b4610284c.jpg","photoPrice":0},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C600%2C572%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=3e9874f8cd95d143ce39be634ec0ae32/622762d0f703918fdcd3a531543d269758eec4cf.jpg","photoPrice":0},{"photoTitle":"清蒸七星海鲈鱼.jpg","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/c995d143ad4bd113410934c95fafa40f4afb0500.jpg","photoPrice":88},{"photoTitle":"剁椒鱼头.jpg","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/d1160924ab18972bd7d5ed31e3cd7b899f510a59.jpg","photoPrice":118},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C600%2C572%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=b480d5e62d34349b604934c5f4da39fe/95eef01f3a292df5715398e9b9315c6035a873bd.jpg","photoPrice":0},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C600%2C572%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=39a224359c25bc313f125bd863efa181/38dbb6fd5266d0161d736fd3922bd40734fa35e6.jpg","photoPrice":0},{"photoTitle":"IMG_3160.JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/9825bc315c6034a83dc9be0ccd13495409237617.jpg","photoPrice":138},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C600%2C572%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=53385f1fb61c8701c2f9e8a61a4fb21f/2934349b033b5bb5b4a1c10533d3d539b700bcd3.jpg","photoPrice":0},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C600%2C400%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=5db1989d0ab30f2421d5b643f5a5fd73/908fa0ec08fa513d00af5f22386d55fbb3fbd9c0.jpg","photoPrice":0},{"photoTitle":"开元一口滑_副本.jpg","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/d01373f082025aaf76925380fdedab64024f1adc.jpg","photoPrice":48},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C600%2C572%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=44c12bf8319b033b38c7a69a28fe1ae3/f11f3a292df5e0fe09cebffd596034a85fdf7273.jpg","photoPrice":0},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C600%2C628%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=040a732051e736d14c5cd648a66063f2/738b4710b912c8fc7fcacb31f9039245d6882114.jpg","photoPrice":0},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C600%2C572%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=73b750ac31a85edfeec3a46374642513/d1160924ab18972b1b813936e3cd7b899f510a96.jpg","photoPrice":0},{"photoTitle":"","url":"http://e.hiphotos.baidu.com/bainuo/crop%3D0%2C0%2C600%2C572%3Bw%3D470%3Bq%3D99%3Bc%3Dnuomi%2C95%2C95/sign=598111f5b43533fae1f9c96e95e3d12f/83025aafa40f4bfbbbb406af064f78f0f63618e0.jpg","photoPrice":0},{"photoTitle":"IMG_3162.JPG","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/c2cec3fdfc03924545b2e0828194a4c27d1e2533.jpg","photoPrice":138},{"photoTitle":"芥兰.jpg","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/4e4a20a4462309f7d5826ae9770e0cf3d6cad658.jpg","photoPrice":38},{"photoTitle":"58ee3d6d55fbb2fbbe035e9f494a20a44623dc17.jpg","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/cb8065380cd791231a3d76adab345982b3b7800e.jpg","photoPrice":5000}]},{"album_id":"14","album_name":"frontPhotoList","album_description":"frontPhotoList","photo_details":[{"photoTitle":"成品图","url":"http://e.hiphotos.baidu.com/nuomi/pic/item/3b87e950352ac65c26ca7734fdf2b21192138aad.jpg","photoPrice":0}]}]}},"success":true};
                data = app.toJson(data);
                if(data.success){
                    var shopData = data.result.shop;
                    //商品价格
                    var shopLocationHtml = template('shopLocationTpl',shopData);
                    $('#shopLocationBox').html( shopLocationHtml );//商品价格
                }
                //离线
                $.refreshScroller();//更新js滚动条
            }
        });
    }


    //打开立即购买弹出层
    $(document).off('click','.showBuyPop').on('click','.showBuyPop',function () {
        event.preventDefault();
        if (canSale==1) {
          $.popup('.popup-buy');
        }
    });
    //跳转
    $(document).off('click','#index .goodsItem').on('click','#index .goodsItem',function () {
        var goodid = $(this).data("goodid");
        $.router.load("../goodsDetail/goodsDetail.html?goodid="+goodid,true);// ignoreCache 是加载一个新页面时是否忽略缓存而发网络请求，默认是 false，表示使用缓存，可以设为 true 来忽略缓存
    });

    //图文详情
    $(document).off('click','.toSeePicture').on('click','.toSeePicture',function () {
        event.preventDefault();
        $('[isPictureView=true]').show();
        $('[isPictureView=false]').hide();
        $('.content').scrollTop("0");
        $.refreshScroller();//更新js滚动条
    });

    //套餐内容
    $(document).off('click','#goGoodsDetail').on('click','#goGoodsDetail',function () {
        event.preventDefault();
        $('[isPictureView=true]').hide();
        $('[isPictureView=false]').show();
        $('.content').scrollTop("0");
        $.refreshScroller();//更新js滚动条
    });

    //立即购买
    $(document).off('click','#buyNow').on('click','#buyNow',function () {
            $.showPreloader();//loding
            //糯米库存与本地库存同时可售时(同时为1),才可以生成订单
            if (canSale!=1 ) {
              $.alert("该商品不可售");
              $.hidePreloader();//隐藏loding
              return false;
            }
            setTimeout(function(){
                $.hidePreloader();//隐藏loding
                $.router.load("../confirm/confirm.html",true);
            },1500);
    });

    //计数器逻辑
    /**
     * [numInit description]
     * @param  {[number]} min [最小值]
     * @param  {[number]} max [最大值]
     */
    function numInit( min , max , callback ){
      var parentDom = $('.inputBox');
      var cut = parentDom.find('.numberInputLeft');
      var add = parentDom.find('.numberInputRight');
      var input = parentDom.find('.goodInput');
      input.val(min);
      cut.off('click').on('click',function () {
        event.preventDefault();
        if (input.val()>min) {
          input.val( input.val()*1-1 );
          typeof callback == 'function' && callback( input.val() );
        }
      });
      add.off('click').on('click',function () {
        event.preventDefault();
        if (input.val()<max) {
          input.val( input.val()*1+1 );
          typeof callback == 'function' && callback( input.val() );
        }
      });
    }

    function numCallback( num ){
      $('#goodNumShow').html( num );
      var currentpriceVal = $('#currentprice').attr('data-currentprice');
      var marketpriceVal = $('#marketprice').attr('data-marketprice');
      $('#currentprice').html( app.format_money(currentpriceVal*num) );//转成元输出
      $('#marketprice').html( app.format_money(marketpriceVal*num) );//转成元输出
    }
    return exportsObj;
})
