var util = require('../../utils/util.js');
var config = require('../../config.js');
var app = getApp()

Page({
	data: {
		source: '',
		videoLength:true,//控制按钮显示
		dateTime: '',//当前日期
		time: '',//当前时间
		city: '',//城市
		temperature: '',//温度
		weather: '',//天气
		videoContext: null,
		appFlag: false,//手机系统判断
		queit: false,//退出全屏
		showInfoModel: false,
		title: '',//页面标题
		momentId:'',//此时此刻更新观看人数接口入参
		videoFlag: true,//更多视频控制
		videoList: [],//视频列表
		touchDot: 0,//触摸时的原点
		time:0,// 时间记录，用于滑动时且时间小于1s则执行左右滑动
		videoLeft:-12.5,//向左滑动默认值
		interval: '',// 记录/清理时间记录
		windowHeight:0,//可视区高度
		currentFlag:0,//视频列表当前播放
		linkUrl: "",
		id: "",
        houseId:config.houseId,
		endTime:''
	},
	// onShareAppMessage(options) {
	// 	return {
	// 		title: '宁波WIII',
	// 		// imageUrl: "/images/1.jpg",
	// 		path: '/pages/video/video?loginid=' + app.globalData.single.loginid
	// 	}
	// },
	onLoad: function (options) {
		var that = this;
		// 页面初始化 options为页面跳转所带来的参数
		console.log("***Video onLoad***", options, '啦啦啦', options.shareToken, options.linkUrl, options.id);
		wx.getSystemInfo({
			success: function (res) {
				if (res.platform == "ios") {
					that.setData({
						appFlag: true
					})
				}
			}
		})
		//console.log('xitong',this.data.appFlag)
		// web-view 组件是一个可以用来承载网页的容器，会自动铺满整个小程序页面。个人类型与海外类型的小程序暂不支持使用。
		// 网页内iframe的域名也需要配置到域名白名单。
		// 开发者工具上，可以在 <web-view/> 组件上通过右键 - 调试，打开 <web-view/> 组件的调试。
		// 每个页面只能有一个<web-view/>，<web-view/>会自动铺满整个页面，并覆盖其他组件。
		// <web-view/>网页与小程序之间不支持除JSSDK提供的接口之外的通信。
		// 在iOS中，若存在JSSDK接口调用无响应的情况，可在<web-view/>的src后面加个#wechat_redirect解决 "#/"
		var that = this;
		this.setData({
			//source:options.source,
			linkUrl: options.linkUrl||"",
			id: options.id||"",
			dateTime: util.timesData(new Date().getTime()),
			time: util.timestampToTime(new Date().getTime())
		})

		wx.request({//获取此时此刻当前播放内容
			url: util.newUrl() + 'elab-marketing-content/moment/queryMomentCurrent',
			method: 'POST',
			data: { houseId: config.houseId },
			success: function (res) {
				console.log('获取视频信息', res)
				that.setData({
					source:encodeURI(decodeURI(res.data.single.videoUrl)),
					title: res.data.single.title,
				})
				console.log(that.data.source, '标题设置')
				wx.setNavigationBarTitle({
					title: that.data.title
				})
			}
		});
		wx.request({
			url: util.newUrl() + 'elab-marketing-authentication/house/detail',
			method: 'POST',
			data:{ id: config.houseId },
			success: function (res) {
				console.log(res, '获取项目明细信息')
				that.setData({
					city:res.data.single.city
				})
				that.getWeather();
				console.log('获取项目明细信息',that.data.city)
			}
		})
		
		wx.getSystemInfo({//获取可视区宽度
			success: function(res) {
			  if(res.platform == "ios"){
				that.setData({
					currentFlag: -1
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
		setTimeout(()=>{
			this.setData({
				endTime:app.globalData.endTime
			})
		},2000)
	},
    toCoupon(){
        wx.navigateTo({ url: '/pages/customPay/customPay' });
    },
	getWeather:function(){
		var that = this;
        wx.request({
			url: util.newUrl() + 'elab-marketing-content/module/queryWeather',
			method: 'POST',
			data:{ city: that.data.city },
			success: function (res) {
				console.log(res, '列表返回')
				that.setData({
					city: res.data.single.data.city,
					temperature: res.data.single.data.forecast[0].low.substring(3),
					weather: res.data.single.data.forecast[0].type
				})
				console.log(that.data.temperature, that.data.city, that.data.weather, '////////')
			}
		})
	},
	moveLeft:function(){//向左滑动视频
		var that = this;
		var viewLeft = that.data.videoLeft;
		var leftPro = (that.data.videoList.length-1)*20;
		
		if(that.data.videoLeft==47.5){
			viewLeft=leftPro;
			return;
		}
		viewLeft+=20;
		that.setData({
			videoLeft:viewLeft
		})
		
		console.log('向左滑动',that.data.videoLeft,'==',leftPro)
	},
	moveRight:function(){//向右滑动视频
        var that = this;
		var viewLeft = that.data.videoLeft;
		var leftPro = (that.data.videoList.length-1)*20;
		if((Math.abs(that.data.videoLeft)==92.5)){
			viewLeft=leftPro;
			return;
		}
		viewLeft-=20;
        that.setData({
			videoLeft:viewLeft
		})
		console.log('向右滑动',that.data.videoLeft,'=====',leftPro)
	},
	switchVideo: function (e) {//切换视频
		var that = this;
		var tag=e.currentTarget.dataset.video;
		console.log(e.currentTarget)
		wx.getSystemInfo({
			success: function (res) {
				console.log('手机判断',res)
				if (res.platform == "ios") {
					that.setData({
						currentFlag: -1
					})
				}else if(res.platform == "android"){
					that.setData({
						currentFlag: e.currentTarget.dataset.id
					})
					console.log('安卓手机',that.data.currentFlag)
				}
			}
		})
		that.setData({
			source:encodeURI(decodeURI(e.currentTarget.dataset.video.videoUrl)),
			//currentFlag:e.currentTarget.dataset.id
		})
		console.log('索引',that.data.currentFlag,e.currentTarget.dataset.id)
		// that.data.videoList.forEach((item,index)=>{
		// 	if(tag.id==item.id){
		// 		that.setData({
		// 			source:item.videoUrl,
		// 			currentFlag:index
		// 		})
		// 		console.log('索引',that.data.currentFlag,index)
		// 		return false;
		// 	}
		// });
	},
	onShow: function (e) {
		console.log("***video.js-onShow***")
		var that = this;
		this.videoContext = wx.createVideoContext('myVideo');

		// var pageid = '10941005';
		// var key = 'sfc.nb.xcx.w3.head.csck';
		// var obj = {
		// 	"pageid": pageid,
		// 	"keyvalue": key + ".enter",
		// }
		// util.reqTrackEventObj(obj, app);
		// var obj = {
		// 	"pageid": pageid,
		// 	"keyvalue": key + ".statetime",
		// 	"usetime": "3000", // 使用时长
		// }
		// util.reqTrackEventTimeObj(obj, app);
		wx.hideShareMenu() //隐藏转发按钮
	},
	onUnload: function () {
		console.log("***video.js-onUnload***");
		var that = this;
		that.setData({
			momentId:wx.getStorageSync('momentId')
		})
		wx.request({
			url:util.newUrl()+'elab-marketing-content/module/modifyMomentView',
			method:'POST',
			data:{
				id:that.data.momentId,
				viewNumber:-1
			},
			success:function(res){
				console.log(res,'返回首页',that.data.momentId)
				wx.navigateBack({
					url: '../index/index'
				})
			}
		})
	},
	goback: function () {//返回
		console.log('返回首页',this.data.momentId)
		wx.navigateBack({
			url: '../index/index'
		})
	},
	moreVideo: function () {//查看更多视频
		var that = this;
		wx.request({//获取此时此刻当前播放内容列表
			url: util.newUrl() + 'elab-marketing-content/moment/queryMomentCurrentList',
			method: 'POST',
			data: { houseId: config.houseId },
			success: function (res) {
				console.log(res, '视频列表返回')
				that.setData({
					videoList: res.data.list
				})
				if(res.data.list.length<=4){
					that.setData({
						videoLength: false
					})
				}
				console.log('返回数据', that.data.videoLength,res.data.list.length)
			}
		})
		this.setData({
			videoFlag: false
		});

		console.log(this.data.videoFlag, '下雪了')
	},
	hideVideo: function () {//隐藏视频
		this.setData({
			videoFlag: true
		});
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
		console.log("***video.js-onHide***")
	}
})