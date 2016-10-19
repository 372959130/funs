define(['app','template','smExtend','linkTo','footer','dialog'],function(app,template,smExtend,linkTo,footer,dialog){
    var exportsObj = {};
    exportsObj.init = function(){
      app.setPageTitle("我的");
      footer.init($('#lifeFooterBar'));//初始化页脚
      getUser();
      $.refreshScroller();//更新js滚动条
    }

    function getUser(){
      $.ajax({
        url: app.url.getUser,
        type: 'POST',
        success:function(data){
          var data = app.toJson(data);
          console.log( 'getUser' , data );
          if(data.code==0){
            var username = data.data.user[0].USERNAME;
            $('.USERNAME_LOGIN').html( username );
            app.setUserObj(data.data.user[0]);
          }else if(data.code==10000||data.code==-1){
            $('.USERNAME_LOGIN').html( "未登录" );
            app.removeUserObj();
          }else{
            $.toast(data.message);
            app.removeUserObj();
          }
        },
        complete : function(){
          var data = {"code":0,"data":{"user":[{"USERNAME":"13929521375","USERID":"364FBF061F274D739E438F45D45CE3E6"}]},"message":"获取成功!","otherData":{}};
          data = app.toJson(data);
          console.log( 'getUser' , data );
          if(data.code==0){
            var username = data.data.user[0].USERNAME;
            $('.USERNAME_LOGIN').html( username );
            app.setUserObj(data.data.user[0]);
          }else if(data.code==10000||data.code==-1){
            $('.USERNAME_LOGIN').html( "未登录" );
            app.removeUserObj();
          }else{
            $.toast(data.message);
            app.removeUserObj();
          }
        }
      })
    }

    //跳转
    $(document).off('click','.head_content').on('click','.head_content',function () {
          if (app.isLogin()) {
            return false;//如果存在用户登录状态,则不弹出登录框
          }
          dialog.showLoginDialog();
    });

    //跳转
    $(document).off('click','#toWaitPayOrder').on('click','#toWaitPayOrder',function () {
        if (app.isLogin()) {
            linkTo.waitPayOrder();
        }else{
            $.toast("登录后才能查询订单信息哦~");
        }
    });

    $(document).off('click','#toOrderUse').on('click','#toOrderUse',function () {
        if (app.isLogin()) {
            linkTo.orderUse();
        }else{
            $.toast("登录后才能查询订单信息哦~");
        }
    });

    $(document).off('click','#logout').on('click','#logout',function () {
        app.removeUserObj();
        $('.USERNAME_LOGIN').html( "未登录" );
        $.toast("注销成功");
    });

    return exportsObj;
})
