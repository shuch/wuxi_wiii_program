var util = require('../../utils/util.js');
var config = require('../../config.js');
var app = getApp()

Page({
	data: {
		source: '',
		videoContext: null,
		appFlag: false,//手机系统判断
		queit: false,//退出全屏
		showInfoModel: false,
		title: '',//页面标题
		momentId:'',//此时此刻更新观看人数接口入参
		videoFlag: true,//更多视频控制
		windowHeight:0,//可视区高度
		currentFlag:0,//视频列表当前播放
		id: ""
	},
	onLoad: function (options) {
		var that = this;
		// 页面初始化 options为页面跳转所带来的参数
		console.log("***Video onLoad***", options, 'bearvideo-啦啦啦', options.source);
		//console.log('xitong',this.data.appFlag)
		// web-view 组件是一个可以用来承载网页的容器，会自动铺满整个小程序页面。个人类型与海外类型的小程序暂不支持使用。
		// 网页内iframe的域名也需要配置到域名白名单。
		// 开发者工具上，可以在 <web-view/> 组件上通过右键 - 调试，打开 <web-view/> 组件的调试。
		// 每个页面只能有一个<web-view/>，<web-view/>会自动铺满整个页面，并覆盖其他组件。
		// <web-view/>网页与小程序之间不支持除JSSDK提供的接口之外的通信。
		// 在iOS中，若存在JSSDK接口调用无响应的情况，可在<web-view/>的src后面加个#wechat_redirect解决 "#/"
		this.setData({
			source:options.source,
		})
		wx.getSystemInfo({//获取可视区宽度
			success: function(res) {
			  if(res.platform == "ios"){
				that.setData({
					currentFlag: -1,
					appFlag: true
				})
			  }
			  that.setData({
				//windowHeight:res.windowHeight
				windowHeight:res.windowWidth
			  })
			  console.log('可视区宽度',res.windowWidth);
			  console.log('可视区高度',res.windowHeight);
			},
		})
	},
	onShow: function (e) {
		console.log("***video.js-onShow***")
		this.videoContext = wx.createVideoContext('myVideo');
		wx.hideShareMenu() //隐藏转发按钮
	},
	onUnload: function () {
		console.log("***video.js-onUnload***")
		// util.stopTrackEventTimeObj();
		// var data = {
		// 	houseId: app.globalData.houseid,
		// 	picUrl: this.data.linkUrl,
		// 	id: this.data.id,
		// 	numberType: '2', // 数字类型(1点赞数|2观看数|3点击数)
		// 	status: "-1", // 1观看，-1 不观看
		// 	uniqueId: app.globalData.openid,
		// }
		// wx.request({
		// 	url: util.url(),
		// 	method: 'POST',
		// 	data: util.reformParam(util.likeUrl, data),
		// 	header: {
		// 		'content-type': 'application/json' // 默认值
		// 	},
		// 	success: function (res) {
		// 		if (res.data.success && res.data.single) {
		// 			console.log("***video-onUnload-video-like***", res.data.single)
		// 		}
		// 		else {
		// 			console.log("***Scale-setLike***", res);
		// 		}
		// 	}
		// })
	},
	goback: function () {//返回
		wx.navigateBack({ delta: 1 });
		// var that = this;
		// that.setData({
		// 	momentId:wx.getStorageSync('momentId')
		// })
		// wx.request({
		// 	url:util.newUrl()+'elab-marketing-content/module/modifyMomentView',
		// 	method:'POST',
		// 	data:{
		// 		id:that.data.momentId,
		// 		viewNumber:-1
		// 	},
		// 	success:function(res){
		// 		console.log(res,'返回首页',that.data.momentId)
		// 		wx.navigateBack({
		// 			url: '../index/index'
		// 		})
		// 	}
		// })
	},
	play: function () {
		// console.log(e.detail.errMsg)
		var self = this;
		// console.log(self.videoContext)
		// 设置全屏播放 进入全屏，可传入{direction}参数 1.4.0
		setTimeout(function () {
			self.videoContext.requestFullScreen(90)
		}, 1000);
	},
	queitFull: function (e) {
		if (!e.detail.fullScreen) {//退出全屏
			this.setData({
				queit: true
			})
			console.log('退出全屏', this.data.queit)
		} else {
			this.setData({
				queit: false
			})
			console.log('进入全屏', this.data.queit)

		}
		//console.log(this.data.queit,'lallalalal',e)
	},
	onReady: function () {
		// 页面渲染完成
		//this.videoContext = wx.createVideoContext('myVideo')
	},
	onHide: function () {
		// 页面隐藏
	}
})