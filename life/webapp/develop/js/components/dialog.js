//样式对应 sass/widget/popup/_dialog.scss

define(['zepto','sm','app'],function($,sm,app){
  var exportsObj = {};

  var registerDialogHtml = 
              '<div class="life_dialogBox" id="registerDialog">'+
                  '<div class="life_mask"></div>'+
                  '<div class="life_dialog">'+
                      '<a href="javascript:;" id="cancelDialog" class="cancelBtn"><img src="../../../images/dialog/close.png"></a>'+
                      '<div class="life_dialog_content">'+
                        '<ul class="life_dialog_list borderT">'+
                          '<li class="borderB"><i class="life_dialog_icon icon_phone"></i><div class="lift_dialog_entry borderL"><input id="registerPhone" type="tel" placeholder="手机号" maxlength="11"></div></li>'+
                          '<li class="borderB"><i class="life_dialog_icon icon_pwd"></i><div class="lift_dialog_entry borderL"><input id="registerPwd" type="password" placeholder="密码(不少于6位)" maxlength="16"></div></li>'+
                          '<li class="borderB"><i class="life_dialog_icon icon_pwd_sure"></i><div class="lift_dialog_entry borderL"><input id="registerPwd2" type="password" placeholder="确认密码" maxlength="16"></div></li>'+
                          '<li class="borderB"><i class="life_dialog_icon icon_code"></i><div class="lift_dialog_entry borderL"><input id="registerCode" type="tel" placeholder="验证码" maxlength="6"><div id="getRegisterCode" class="getCode">获取验证码</div></div></li>'+
                        '</ul>'+
                      '</div>'+
                      '<div class="life_dialog_footer">'+
                        '<div id="registerBtn" class="life_dialog_footer_oneBtn">注册</div>'+
                      '</div>'+
                  '</div>'+
              '</div>';

var loginDialogHtml =
              '<div class="life_dialogBox" id="loginDialog">'+
                  '<div class="life_mask"></div>'+
                  '<div class="life_dialog">'+
                      '<a href="javascript:;" id="cancelDialog" class="cancelBtn"><img src="../../../images/dialog/close.png"></a>'+
                      '<div class="life_dialog_content">'+
                        '<ul class="life_dialog_list borderT">'+
                          '<li class="borderB"><i class="life_dialog_icon icon_phone"></i><div class="lift_dialog_entry borderL"><input id="loginPhone" type="tel" placeholder="手机号" maxlength="11"></div></li>'+
                          '<li class="borderB"><i class="life_dialog_icon icon_pwd"></i><div class="lift_dialog_entry borderL"><input id="loginPwd" type="password" placeholder="密码"></div></li>'+
                        '</ul>'+
                        '<div class="life_dialog_findPwdBox">'+
                          '<i class="life_dialog_icon icon_wen"></i>'+
                          '<span class="noUse">找回密码</span>'+
                        '</div>'+
                      '</div>'+
                      '<div class="life_dialog_footer">'+
                        '<div class="life_dialog_footer_twoBtn">'+
                          '<div id="loginBtn">登录</div>'+
                          '<div id="toRegisterDialog">注册</div>'+
                        '</div>'+
                      '</div>'+
                  '</div>'+
              '</div>';

              //删除dialog
              var removeDialogBox = function(){
                if ( $('.life_dialogBox').length>0 ) {
                  $('.life_dialogBox').remove();
                }
              }

              //验证父容器.content-inner是否存在
              var validate = function(){
                if ($('.content-inner').length==0) {
                  console.warn('dialog的父容器".content-inner容器不存在"');
                  return false;
                };
                return true;
              }

              //dialog按钮的时间绑定
              var bindEvent = function(){
                //关闭按钮
                $(document).off('click','#cancel').on('click','#cancelDialog',function () {
                     removeDialogBox();
                });
                //登录按钮
                $(document).off('click','#loginBtn').on('click','#loginBtn',function () {
                     login();
                }); 
                //切换到注册dialog按钮
                $(document).off('click','#toRegisterDialog').on('click','#toRegisterDialog',function () {
                     exportsObj.showRegisterDialog( );
                });
                //注册按钮
                $(document).off('click','#registerBtn').on('click','#registerBtn',function () {
                     register();
                });
                //获取手机验证码按钮
                $(document).off('click','#getRegisterCode').on('click','#getRegisterCode',function () {
                     getCode();
                });
              }

              //登录
              sendLoginFlag = false;//防止重复点击
              function login(){
                  if (!sendLoginFlag) {
                    var loginPhone = $('#loginPhone').val();
                    var loginPwd = $('#loginPwd').val();

                    var writeAll = true;//是否填写所有信息框
                    $('#loginDialog').find('.life_dialog_list').find('input').each(function(index, el) {
                      if ( $.trim( $(this).val() ) == "" ) {
                        writeAll = false;
                      }
                    });
                    if (writeAll==false) {
                      $.toast("请输入完整的登录信息");
                      return false;
                    }


                    $.ajax({
                        type: "POST",
                        url: app.url.login,
                        data: {
                            username : loginPhone,
                            password : loginPwd,
                            customerChannelId : app.getRequest().customerChannelId
                        },
                        beforeSend : function(){
                          sendLoginFlag = true;
                          $.showIndicator();
                        },
                        success: function (data) {
                            var data = app.toJson(data);
                            console.log( 'login',data );
                            if(data.code==0){
                              var username = data.data.user[0].USERNAME;
                              
                              $('.USERNAME_LOGIN').each(function(index, el) {
                                $(this).html( username );
                              });
                              removeDialogBox();//隐藏dialog
                              app.setUserObj(data.data.user[0]);
                            }else{
                              $.toast(data.message);
                            }
                        },
                        complete : function(){
                            sendLoginFlag = false; 
                            $.hideIndicator();
                        }
                    });
                  }
              }

             //注册
              registerFlag = false;//防止重复点击
              function register(){
                  if (!registerFlag) {
                    var registerPhone = $('#registerPhone').val();//电话号码
                    var registerPwd = $('#registerPwd').val();//密码
                    var registerPwd2 = $('#registerPwd2').val();//确认密码
                    var registerCode = $('#registerCode').val();//验证码

                    var writeAll = true;//是否填写所有信息框
                    $('#registerDialog').find('.life_dialog_list').find('input').each(function(index, el) {
                      if ( $.trim( $(this).val() ) == "" ) {
                        writeAll = false;
                      }
                    });
                    if (writeAll==false) {
                      $.toast("请输入完整的注册信息");
                      return false;
                    }

                    if ( registerPwd.length < 6 ) {
                      $.toast("密码不得少于6位");
                      return false;
                    }

                    if ( registerPwd!=registerPwd2 ) {
                      $.toast("两次密码输入不一致,请重新输入");
                      return false;
                    }

                    $.ajax({
                        type: "POST",
                        url: app.url.register,
                        data: {
                            username : registerPhone,
                            password : registerPwd,
                            accode : registerCode,
                            customerChannelId : app.getRequest().customerChannelId
                        },
                        beforeSend : function(){
                          registerFlag = true;
                          $.showIndicator();
                        },
                        success: function (data) {
                            var data = app.toJson(data);
                            console.log( 'register',data );
                            if(data.code==0){
                              var username = data.data.user[0].USERNAME;
                              $('.USERNAME_LOGIN').each(function(index, el) {
                                $(this).html( username );
                              });
                              $.alert("请牢记您的用户名与密码","注册成功");
                              removeDialogBox();//隐藏dialog
                              app.setUserObj(data.data.user[0]);
                            }else{
                              $.toast(data.message);
                            }
                        },
                        complete : function(){
                            registerFlag = false; 
                            $.hideIndicator();
                        }
                    });
                  }
              }

             //登录
              getCodeFlag = false;//防止重复点击
              function getCode(){
                  if (!getCodeFlag) {
                    var registerPhone = $('#registerPhone').val();//电话号码

                    if ( $.trim( registerPhone ) == "" ) {
                      $.toast("请输入手机号码");
                      return false;
                    }

                    $.ajax({
                        type: "POST",
                        url: app.url.getCode,
                        data: {
                            acphone : registerPhone,
                            customerChannelId : app.getRequest().customerChannelId
                        },
                        beforeSend : function(){
                          getCodeFlag = true;
                          $.showIndicator();
                        },
                        success: function (data) {
                            var data = app.toJson(data);
                            console.log( 'getCode',data );
                            if(data.code==0){
                              $.toast("验证码正在发送,请留意手机信息");
                            }else{
                              $.toast(data.message);
                            }
                        },
                        complete : function(){
                            getCodeFlag = false; 
                            $.hideIndicator();
                        }
                    });
                  }
              }

              exportsObj.removeDialog = removeDialogBox;

              exportsObj.showRegisterDialog = function(){
                if (validate()) {
                  removeDialogBox();
                  $('.content-inner').append( registerDialogHtml );
                  $('#registerDialog').show();
                  bindEvent();
                }
              }
              exportsObj.showLoginDialog = function(){
                if (validate()) {
                  removeDialogBox();
                  $('.content-inner').append( loginDialogHtml );
                  $('#loginDialog').show();
                  bindEvent();
                }
              }

              return exportsObj;
})