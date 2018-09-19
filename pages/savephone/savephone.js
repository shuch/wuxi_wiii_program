var util = require('../../utils/util.js');
var app = getApp();
var config = require('../../config.js')
var serverUrl="http://skyforest.static.elab-plus.com/";
Page({
    data: {
        verifyText: '获取验证码',
        isSend: false,
        tel: '',
        dialog: false,
        verifyCode: '',
        serverUrl: serverUrl,
        pathName: {},
        templateContentId: '',
        flag: false,
        projectPhone:'(0574)5568 6666',
        projectId: '',
        sharerImage:'',//二维码
        channel:''//渠道
    },
    onLoad: function (options) {

        // this.sharerImage = this.$route.query.sharerImage||'';
        // this.channel = this.$route.query.channel||'';
        // 页面初始化 options为页面跳转所带来的参数
        //this.telData();

    },
onShow:function(){
    var that = this;
    wx.request({
        url:util.newUrl()+'elab-marketing-authentication/house/detail',
        method:'POST',
        data:{id:config.houseId},
        success:function(res){
            if(res.data.success){
                that.setData({
                    projectPhone:res.data.single.tel
                })
            }
        }
    })
},
    getVerifyCode:function(){//验证码
        var that = this;
        if(that.data.isSend){
            return
        }
        if (!/^1\d{10}$/.test(that.data.tel)) {
            wx.showToast({
                title: '输入的手机号不合法',
                icon:"none",
                duration: 2000
            })
            return;
        }
        wx.request({
            url: util.newUrl()+'elab-marketing-authentication/vcode/verifyCodeForLeavePhone/send',
            method: 'POST',
            data:  {phoneNumber: that.data.tel},
            header:{
                'content-type': 'application/json', // 默认值
                'tonken':app.globalData.tonken},
            success: function() {
                that.setData({
                    isSend: true,
                    showAdmit:true,
                    toView:'empty-box'
                });
                let time = 60;
                let time1 = setInterval(function(){
                    if(time>0){
                        time = time-1;
                        that.setData({
                            verifyText: time +'秒后获取'
                        })
                        //that.data.verifyText = time +'秒后获取'
                    }else{
                        that.setData({
                            verifyText:'获取验证码'
                        })
                        that.setData({
                            isSend:false
                        })
                        clearInterval(time1)
                    }
                },1000)
            },
            fail:function(){
                wx.showToast({
                    title: '网络连接出现问题，请稍后再试！',
                    icon:"none",
                    duration: 2000
                })
            }
        });		
    },
    sendTel:function(){//点击打钩按钮
        var that = this;
        if(that.data.flag){
            return
        }
        that.setData({
            flag:true
        });
        if (!/^1\d{10}$/.test(that.data.tel)) {
            wx.showToast({
                title: '请输入正确的手机号',
                icon:"none",
                duration: 2000
            });
            that.setData({
                flag:false
            });
            return;
        }
        console.log(that.data.verifyCode.length)
        if(that.data.verifyCode.length<1){
            wx.showToast({
                title: '验证码不能为空',
                icon:"none",
                duration: 2000
            });
            that.setData({
                flag:false
            });
            return;
        }
        
        wx.request({
            url: util.newUrl()+'elab-marketing-authentication/contact/leavephone/miniapp/insert',
            method: 'POST',
            data: {
                houseId:config.houseId,
                leavePhoneCustomerId : app.globalData.single.id,
                shareParam : app.globalData.fromChannel,
                mobile: that.data.tel,
                code: that.data.verifyCode,
                source:"3"
            },
            header:{
                'content-type': 'application/json', // 默认值
                'token':app.globalData.tonken},
            success:function(res){
                console.log(res,'//////')
                if(res.data.success){
                    that.telData();
                    that.setData({
                        dialog:true
                    });
                    setTimeout(function(){
                        that.setData({
                            dialog:false
                        });
                        // wx.navigateTo({
                        //     url: '../index/index'
                        // });
                    },2000);
                }else{
                    wx.showToast({
                        title: res.data.message,
                        icon:"none",
                        duration: 2000
                    });
                    that.setData({
                        flag:false
                    });
                }
            },
            fail:function(re){
                wx.showToast({
                    title: res.data.message,
                    icon:"none",
                    duration: 2000
                });
                that.setData({
                    flag:false
                });
            }
        });		
    },
    telData:function(){//留电接口
        var that = this;
        var pages = getCurrentPages();
        var currentPage = pages[pages.length-1]
        var urlhref = currentPage.route;
        console.log('当前页面链接',currentPage.route)
        wx.request({
            url: util.url(),
            method:'POST',
            data: util.reformParam(util.savephone,{houseid: app.globalData.houseid,name:app.globalData.loginid,channel:app.globalData.fromChannel,mobile: that.data.tel,platform:'3',refer:urlhref}),
            success:function(){
                var pageid='10941011';
                var key='sfc.nb.app.home.videoshow.preorder';
                var obj={
                    "pageid":pageid,
                    "keyvalue":key + ".click",
                }
                util.reqTrackEventObj(obj,app);
            },
            fail:function(re){
                
            }
        });
    },
    userPhone:function(e){
        console.log(e,'寂静欢喜')
        this.setData({
            tel: e.detail.value
        })
    },
    verifyCode:function(e){
        console.log(e,'yuan')
        this.setData({
            verifyCode: e.detail.value
        })
        console.log(this.data.verifyCode,'===============')

    },
    goAdviserList:function(){
        wx.navigateTo({
			url: '../counselorList/counselorList'
		});
    },
    onReady: function () {
        // 页面渲染完成
    },
})