var app  = getApp();
var util = require('../../utils/util.js')
var tls = require('../../utils/tls.js')
var webim = require('../../utils/webim_wx.js')
var config = require('../../config.js');
//var webim = require('../../utils/webim.js')
var webimhandler = require('../../utils/webim_handler.js')
var {authorizeInfo,getUserInfo} = require('../../getlogininfo.js')
var serverUrl=util.getImgUrl();
var onloadTime = null;
var pvCurPageParams = '';
Page({
	data:{
		ePic:serverUrl+'wepy_pro/e-pic.png',//右上角进入视频按钮
		defaultImg:serverUrl+'wepy_pro/Avatar_male.png',
		moreImg:serverUrl+'wepy_pro/more-coun.png',//更多顾问按钮
		loadingImg:serverUrl+'wepy_pro/loading.gif',
        showInfoModel:false,
        infoFun:null,
        despage:'xiaoxiliebiao',
        infoFailFun:null,
        isShowVideoButton:false,
        showPhoneModel:false,
        phoneFun:null,
        phoneFailFun:null,
        videoList:[],
		fixImg:serverUrl+'wepy_pro/fix-b.png',//底部固定图片
		loading:false,//loading控制
		moreFag:false,//控制更多顾问按钮
		Config:{
			sdkappid: config.sdkAppID,
			accountType: config.accType,
			accountMode: 0 //帐号模式，0-表示独立模式，1-表示托管模式
		},
		adviserList:[],
		isSentAdviserList:[]
	},
	textChange:function(val){
		if(val.includes('csyzwfelab20180425hhhdfq')){
			let newVal = JSON.parse(val);
			if(newVal.type==506){
				return '[视频]'
			}else if(newVal.type==507){
				return '[链接]'
			}else if(newVal.type==508){
				return '[此时此刻]'
			}
			else if(newVal.type==513){
				return ''
			}
			else if(newVal.type==102){
				return ''
			}
			else if(newVal.type==104){
				return '[e看房]'
			}else if(newVal.type==501){
				return '[视频通话失败]'
			}else if(newVal.type==500){
				return '[视频通话成功]'
			}
			else if(newVal.type==509){
				return '[图片]'
			}
			else if(newVal.type==502){
				return '[获取手机号码]'
			}
			else if(newVal.type==204){
				return '[PDF文件]'
			}else if(newVal.type==515||newVal.type==516){
				return newVal.param.text
			}else{
					return ''
			}
		}else if(val.includes('【系统消息】')||val.includes('【系统提示】')||val.includes('顾问不存在')||val.includes('onChangePlay')||val.includes('视频通话')){
				return ''
			}
			else if(val.includes('e看房已发送')||val.includes('发起视频看房请求')){
			return ''
		}
		else{
			return val
		}
	},
	goVideo: function (e) {
		wx.getSetting({
            success: (response) => {
                console.log("***rtcroomCom.onLoad***getSetting",response)
                // 没有授权
                if (!response.authSetting['scope.record']){
                    wx.authorize({
                        scope: 'scope.record',
                        complete(res) {
                        	console.log("******",res);
                            if(!response.authSetting['scope.camera']){
                                wx.authorize({
                                    scope: 'scope.camera',
                                    complete() {
                                        wx.navigateTo({
                                            url:'../multiroom/aide/aide'
                                        })
                                    }
                                })
                            }else{
                                wx.navigateTo({
                                    url:'../multiroom/aide/aide'
                                })
                            }
                        }
                    })
				}
                else{
                    if(!response.authSetting['scope.camera']){
                        wx.authorize({
                            scope: 'scope.camera',
                            complete() {
                                wx.navigateTo({
                                    url:'../multiroom/aide/aide'
                                })
                            }
                        })
                    }else{
                        wx.navigateTo({
                            url:'../multiroom/aide/aide'
                        })
                    }

                }

            },
            fail: function () {
                // typeof cb == "function" && cb()
                wx.showToast({
                    title: '系统提示:网络错误',
                    icon: 'warn',
                    duration: 1500,
                })
            }
        })

	},
	onShow: function(e){
        wx.setStorageSync('loadTime',new Date().getTime())
        var that = this;
            app.login(function(obj){
                let param = {
                    type:'PV',
                    pvId:'P_2cMINA_3',
                    pvCurPageName:'xiaoxiliebiao',//当前页面名称
                    pvCurPageParams:pvCurPageParams,//当前页面参数
                    pvLastPageName:getCurrentPages()[getCurrentPages().length-2]?getCurrentPages()[getCurrentPages().length-2].data.despage:'',//上一页页面名称
                    pvLastPageParams:'',//上一页页面参数
                    pvPageLoadTime:(new Date().getTime() - wx.getStorageSync('loadTime')),//加载时间
                }
                console.log(param,'埋点')
                util.trackRequest(param,app)
                wx.request({
                        url:util.newUrl()+'elab-marketing-authentication/adviser/video/callLog',
                        method:'POST',
                        data:{
                            customerId:app.globalData.single.id,
                            houseId:config.houseId
                        },
                        success:function(res){
                            if(res.data.single){
                                that.setData({
                                    isShowVideoButton:true
                                })
                            }
                        }
                    }
                )
            });
		wx.setNavigationBarTitle({
			title: '在线咨询'
		});
		if(!app.globalData.isUserInfo){
            authorizeInfo.call(this,function(){
            },function(){
            });
		}
        if(!app.globalData.tmpPhone){
            this.authorizeIndexPhone(function () {
            },function () {
            })
        }
		this.initData();
	},
    getPhoneNumber: function (e) {
        var self = this;
        // 隐藏
        this.setData({
            showPhoneModel: false
        })
        wx.setStorageSync('ISauthorizePhone',true);// 是否授权过手机号,
        var iv = e.detail.iv;
        var errMsg = e.detail.errMsg;
        var houseid=app.globalData.houseid;
        var token=app.globalData.tonken||"";
        var encryData = e.detail.encryptedData;
        var session = app.globalData.sessionKey;
        var appid = app.globalData.appid;//"wxa6aef323462b8b14";
        console.log("***token***",token)
		app.globalData.tmpPhone = true
        // var pc = new WXBizDataCrypt(appid, session);
        console.log("****getPhoneNumber****")
        // 用户未授权
        if (e.detail.errMsg.includes("fail")){
            typeof self.data.phoneFailFun == "function" && self.data.phoneFailFun();
        }
        else{
            var parm={
                encryptedData:encryData,
                sessionKey:session,
                appId:appid,
                customerId: app.globalData.single.id,
                houseId:config.houseId,
                shareParam : app.globalData.fromChannel,
                iv:iv
            };
            wx.request({
                url: util.newUrl()+'elab-marketing-authentication/position/queryPositionPhone',
                method: 'POST',
                data: parm,
                header: {
                    'content-type': 'application/json', // 默认值
                    'auth_token':token
                },
                success:function(res){
                    console.log('解密后 data: ', res);
                    if(res.data.success && res.data.single){
                        console.log(res.data.single)
                        app.globalData.phone = res.data.single.phone;
                        wx.setStorageSync('phone', res.data.single.phone);
                        self.setData({
                            showPhoneModel: false,
                            showPhoneAuth:true,
                        })
                        // 存在跳转的
                        typeof self.data.phoneFun == "function" && self.data.phoneFun(); // 执行回调函数
                    }
                },
                fail:function(res){
                    typeof self.data.phoneFailFun == "function" && self.data.phoneFailFun();
                    console.log(res,'解密手机号失败ggggggggggg')
                }
            });
        }
    },
    authorizeIndexPhone(cb,failcb){
        var that = this;
        // wx.getStorageSync('ISauthorizePhone');// 是否授权过手机号,
        if(!wx.getStorageSync('phone')){
            app.globalData.phone = wx.getStorageSync('phone');
            console.log("***authorizeIndexPhone***",app.globalData.phone,wx.getStorageSync('phone'))
            // 没有获得用户手机号
            if(!app.globalData.phone){
                that.setData({
                    showPhoneModel: true,
                    phoneFun:cb||null,
                    phoneFailFun:failcb||null
                })
            }
            else{
                that.setData({
                    showPhoneModel: false,
                    showPhoneAuth:true
                })
                typeof cb == "function" && cb()
            }
        }else{
            typeof cb == "function" && cb()
        }
    },
    getUserInfo: function (e) {
        getUserInfo.call(this,e);
    },
    onUnload:function(){

        util.stopTrackEventTimeObj()
    },
	goAdviserList:function(e){
        let param = {
            type:'CLK',//埋点类型
            pvPageStayTime:(new Date().getTime()-wx.getStorageSync('loadTime'))/1000,
            imTalkType:'wenziliaotian',
            clkDesPage:'xuanzeguwenliebiao',//点击前往的页面名称
            clkName:'gengduoguwen',//点击前往的页面名称
            clkId:'clk_2cmina_26',//点击ID
            clkParams:'',//点击参数
        }
        util.trackRequest(param,app)
		wx.navigateTo({
		    url: '../counselorList/counselorList',
		})
	},
	initData:function(){
        console.log('准备登陆IM',new Date().getTime() - onloadTime)
        this.setData({
            loading:true
        })
		var token = app.globalData.tonken;
		var identifier = app.globalData.identifier;
		var time = util.formatTime(new Date())
		var that = this;
		let result = '';
		webimhandler.init({
			accountMode:that.data.Config.accountMode,
			accountType: that.data.Config.accountType,
			sdkAppID: that.data.Config.sdkappid,
			selType: webim.SESSION_TYPE.C2C,
			selSess: null //当前聊天会话
		});
		var loginInfo = {//当前用户身份
			'sdkAppID': that.data.Config.sdkappid, //用户所属应用id,必填
			'appIDAt3rd': that.data.Config.sdkappid, //用户所属应用id，必填
			'accountType': that.data.Config.accountType, //用户所属应用帐号类型，必填
			'identifier': identifier, //当前用户ID,必须是否字符串类型，选填
			'identifierNick': app.globalData.single.nickname, //当前用户昵称，选填
			'userSig':app.globalData.userSig //当前用户身份凭证，必须是字符串类型，选填
		};
		var listeners = {
			"onConnNotify": webimhandler.onConnNotify, //选填
			"onBigGroupMsgNotify": function (msg) {
				webimhandler.onBigGroupMsgNotify(msg, function (msgs) {
				})
			}, //监听新消息(大群)事件，必填
			"onMsgNotify": function (msg) {
				webimhandler.onMsgNotify(msg, function (msgs) {
					console.log(msgs,'ppppppp')
					var msg = '【系统消息】该用户当前登录方式为微信小程序登录，无法使用此功能';
                    var noAuth = '【系统消息】当前用户未授权手机号，暂时无法获取。请通过聊天方式索取客户手机号码！';
					if(msgs.content&&msgs.content.type==102||msgs.content.type==512){
						webimhandler.onSendMsg(msg,{TYPE:webim.SESSION_TYPE.C2C,myselToID:msgs.fromAccountNick});
                        that.addNewMsg(msgs)
						return
					}else if(msgs.content&&msgs.content.type==502){
						if(msgs.content.param.isShowInvitation){
                            wx.setStorageSync('isGiveTel',false)
							console.log(msgs.content,'ppp')
							if(wx.getStorageSync('phone')){
                                that.addNewMsg(msgs);
                                return
							}else{
                                webimhandler.onSendMsg(noAuth,{TYPE:webim.SESSION_TYPE.C2C,myselToID:msgs.fromAccountNick});
                                return
							}
						}else{
							console.log('go')
							return
						}
					}
					else if(msgs.content&&msgs.content.type==513){
						return
					}
					else if(msgs.content&&(typeof msgs.content=='string')&&msgs.content.includes('onChangePlayAudio')){
						webimhandler.onSendMsg(msg,{TYPE:webim.SESSION_TYPE.C2C,myselToID:msgs.fromAccountNick});
						return
					}
					else{
						that.addNewMsg(msgs)
					}

				})
			},//监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
			"onGroupSystemNotifys": webimhandler.onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，必填
			"onGroupInfoChangeNotify": webimhandler.onGroupInfoChangeNotify//监听群资料变化事件，选填
		};
		var options = {
			'isAccessFormalEnv': true,//是否访问正式环境，默认访问正式，选填
			'isLogOn': false//是否开启控制台打印日志,默认开启，选填
		};
		webimhandler.sdkLogin(loginInfo, listeners, options,function(){
			console.log('登录成功')
            console.log('登陆Im完成，准备load本地列表',new Date().getTime() - onloadTime)
			that.getHistoryMsgs();
		},function(err){
			console.error(err.ErrorInfo,'回调函数失败');
		});
		
	},
	addNewMsg:function(msg){
		let newMsg = msg;
		let that = this;
		console.log(newMsg,'new',that.data.adviserList)

		 for(let i = 0;i<that.data.adviserList.length;i++){
			 if(that.data.adviserList[i].id ==msg.fromAccountNick.substring(0,msg.fromAccountNick.indexOf('_'))){
				 newMsg = Object.assign(that.data.adviserList[i],msg);
				 console.log(newMsg,'加最新消息了')

			 }
		 }
		 console.log(that.data.isSentAdviserList,newMsg,'iopkojo')

		 let flag = false
		 for(let j = 0;j<that.data.isSentAdviserList.length;j++){
			 if(newMsg.id==that.data.isSentAdviserList[j].id){
				 console.log('即将崛起', typeof newMsg.content)
				 flag = true;
				 var hasNewMsg = 'isSentAdviserList['+j+'].hasNewMsg';
				 var msgshow = 'isSentAdviserList['+j+'].MsgShow';
				 var tmeStamp = 'isSentAdviserList['+j+'].MsgTimeStamp';
				 that.setData({
					[hasNewMsg]:that.data.isSentAdviserList[j].hasNewMsg+1
				})
				
				 if(
					 typeof newMsg.content=='object'
				 ){
					that.setData({
						[msgshow]:that.textChange(JSON.stringify(newMsg.content))
					})
					// that.data.isSentAdviserList[j].MsgShow = that.textChange(JSON.stringify(newMsg.content));
				 }else{
					that.setData({
						[msgshow]: that.textChange(newMsg.content)

					})
					// that.data.isSentAdviserList[j].MsgShow =
				 }
				//  that.data.isSentAdviserList[j].MsgTimeStamp = util.formatTodayTime(new Date());
				 that.setData({
					[tmeStamp]: util.formatTodayTime(new Date())

				})
				 return
			 }
		 }
		 if(!flag){
			//newMsg.hasNewMsg = 1;
			that.data.isSentAdviserList.unshift(newMsg);
		 }
	},
	getHistoryMsg:function(){
		var token = app.globalData.tonken;
		var time = util.formatTime(new Date());
		var that = this;
		webim.getRecentContactList({
			'Count': 100 //最近的会话数 ,最大为 100
		},function(resp){
			console.log(resp,'yy')
			if(!resp.SessionItem||!resp){
				return false
			}
			if(resp.SessionItem.length>0){
                // for(var i=0;i<resp.SessionItem.length;i++){
                //     for(var m =0;m<that.data.videoList.length;m++){
                //         var outData = resp.SessionItem[i].To_Account;
                //         if(outData.substring(0,outData.indexOf('_'))==that.data.videoList[m].id){
                //         	console.log(outData.substring(0,outData.indexOf('_')),'[[[[[[[[[')
                //             resp.SessionItem.splice(i,1)
					// 		i--;
                //             break
                //         }
                //     }
                // }
                var tmpList = [];
				for(var i =0;i<resp.SessionItem.length;i++){
					console.log(resp,'yyyyyy')
                    for(var j = 0;j<that.data.adviserList.length;j++){
                        var outData = resp.SessionItem[i].To_Account;
                        if(outData.substring(0,outData.indexOf('_'))==that.data.adviserList[j].id){
                            resp.SessionItem[i] = Object.assign(resp.SessionItem[i],that.data.adviserList[j])
                            resp.SessionItem[i].MsgTimeStamp=util.formatTodayTime(new Date(resp.SessionItem[i].MsgTimeStamp*1000))
                            console.log( resp.SessionItem[i].MsgShow)
                            resp.SessionItem[i].MsgShow = that.textChange(resp.SessionItem[i].MsgShow)
                            tmpList.push(resp.SessionItem[i])
                        }
                    }


				}
                that.setData({
                    isSentAdviserList:tmpList
                });
			}else{
				alert('暂无最新消息')
			}
            console.log(that.data.isSentAdviserList)

			that.setData({
				moreFag:true
			});
            console.log('拿到IM列表',new Date().getTime() - onloadTime)
			console.log('渲染数据',that.data.isSentAdviserList)
			//that.loading = false;
			//业务处理
		},function(resp){
			// setTimeout(()=>{
			// 	that.getHistoryMsg();
			// },1000)
			console.log(resp,'gggg')
			//错误回调
		});
	},
    proto_getLoginInfo: function() {
        wx.request({
            url: util.newUrl()+'elab-marketing-authentication/tencent/signature',
            method: 'POST',
            data:  {
                identifier: app.globalData.identifier,
                appId: config.sdkAppID
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(ret) {
                if (ret.data.code) {
                    console.log('获取登录信息失败，调试期间请点击右上角三个点按钮，选择打开调试');
                    wx.showToast({
                        title: ret.data.message + '[' + ret.data.code + ']',
                        icon: 'warn',
                        duration: 1500,
                    });
                    return;
                }
                console.log('获取usersig登录信息成功', ret);
                app.globalData.userSig = ret.data.single.signature;
            },
            fail: function(ret) {
                console.log('获取IM信息失败: ', ret);
                if (ret.errMsg == 'request:fail timeout') {
                    wx.showToast({
                        title: "网络请求超时，请检查网络状态",
                        icon: 'warn',
                        duration: 1500,
                    })
                } else {
                    wx.showToast({
                        title: ret.errMsg,
                        icon: 'warn',
                        duration: 1500,
                    })
                }
            }
        });
    },
	getHistoryMsgs:function(){
		var that = this;
		let time = util.formatTime(new Date());
		var token = app.globalData.tonken;
        that.setData({
			loading:true
		})
		wx.request({
			header:{
				token:token
			},
			url:util.newUrl()+'elab-marketing-authentication/adviser/text/queryImChatRecord',
			method:'POST',
			data: { houseId: config.houseId, customerId:app.globalData.single.id },
			success:function(res){
				//console.log(res,'----消息列表返回----')
				that.data.adviserList =  res.data.list||[];
				
				that.data.adviserList.forEach((item)=>{
					item.hasNewMsg = 0;
				});
				console.log(that.data.adviserList,'=========')
				setTimeout(function(){
                    console.log('本地列表加载完成，准备获取im列表',new Date().getTime() - onloadTime)
					that.getHistoryMsg();
				},200)
				that.setData({
					loading:false
				});
				
			}			
		});
	},
	onLoad:function(options){
	    var that = this;
        pvCurPageParams = JSON.stringify(options);
        onloadTime = new Date().getTime();

		// var isSend = wx.getStorageSync('isSend'+config.houseId);
		// if(!isSend){
		// 	wx.navigateTo({
		// 		url:'../counselorList/counselorList'
		// 	})
		// }
		// wx.getSetting({
		// 	success: (response) => {
		// 	  // typeof cb == "function" && cb()
		// 	  // 没有授权需要弹框
		// 	  if (!response.authSetting['scope.userInfo']) {
		// 		wx.showToast({
		// 		  title: '未授权,访问受限',
		// 		  icon: 'none',
		// 		  duration: 1500,
		// 		})
		// 		wx.navigateTo({
		// 			url:'../index/index?fromChannel='+options.shareToken
		// 		})
		// 	  }
		// 	},
		// 	fail: function () {
		// 	  // typeof cb == "function" && cb()
		// 	  wx.showToast({
		// 		title: '系统提示:网络错误',
		// 		icon: 'none',
		// 		duration: 1500,
		// 	  })
		// 	}
		// })
	},
	goChat:function(e){
		var item = e.currentTarget.dataset.item;
		
		wx.setStorageSync('adviserInfo',JSON.stringify(item));
        let param = {
            type:'CLK',//埋点类型
            pvPageStayTime:(new Date().getTime()-wx.getStorageSync('loadTime'))/1000,
            adviserId:item.id,
            imTalkId:item.id+'_'+app.globalData.single.id+'_'+config.houseId,
            imTalkType:'wenziliaotian',
            clkDesPage:'liaotianchuangkou',//点击前往的页面名称
            clkName:'xuanzeguwenliaotian',//点击前往的页面名称
            clkId:'clk_2cmina_25',//点击ID
            clkParams:'',//点击参数
        }
        util.trackRequest(param,app)
		wx.navigateTo({
			url: '../chat/chat'
		});
		//console.log('打印数据',e,'大鱼',JSON.stringify(item))
	}
})