var config = require('../config.js');
var setIntervalKey;
if(!wx.getStorageSync('sessionNumber')){
    wx.setStorageSync('sessionNumber',0);
}
var session = wx.getStorageSync('sessionNumber')+1;
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatCNTime(val){
    const year = val.getFullYear();
    const month = val.getMonth()+1;
    const day = val.getDate();
    const hour = val.getHours();
    const minute = val.getMinutes();
    const second = val.getSeconds();
        return year+'年'+(month>9?month:'0'+month)+'月'+day+'日'+hour+'时'+(minute>9?minute:'0'+minute)+'分'+second+'秒';

}
function formatTodayTime(val){
    const year = val.getFullYear();
    const month = val.getMonth()+1;
    const day = val.getDate();
    const hour = val.getHours();
    const minute = val.getMinutes();

    if(month==new Date().getMonth()+1&&day+1==new Date().getDate()){
        return '昨天'+hour+':'+(minute>9?minute:'0'+minute);
    }
    else if(month==new Date().getMonth()+1&&day==new Date().getDate()){
        return hour+':'+(minute>9?minute:'0'+minute);
    }else{
        return year+'-'+(month>9?month:'0'+month)+'-'+day+' '+hour+':'+(minute>9?minute:'0'+minute);
    }
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function normalTime(n) {
  if(isNaN(n)){
    return "00"
  }
  
  if(parseInt(n) < 10){
    return '0'+n
  }
  return n
}
function getImgUrl(){
  // if(env==='test'){
  //   return "../../image/"
  // }
  // else if(env==='prod'){
  //   return "http://skyforest.static.elab-plus.com/"
  // }
  return config.ImgUrl;
}
function reformParam(methodName,para) {
	
  var parameter = {}
  parameter['merchantid'] = '3'
  parameter['version'] = '1'
  parameter['sign_type'] = 'RSA'
  parameter['sign'] = '123'
  parameter['charset'] = 'UTF-8'
  parameter['method'] = methodName
  var context = ''
  for(var key in para){
    context += '&'+key+'='+para[key]
  }
  parameter['context'] = context
  return parameter
}
function trackRequest(para,app){
    if(JSON.stringify(para.clkParams)==='{}'){
        para.clkParams = '';
    }
    if(JSON.stringify(para.expand)==='{}'){
        para.expand = '';
    }
    if(JSON.stringify(para.pvCurPageParams)==='{}'){
        para.pvCurPageParams = '';
    }
  let data = {
      session:session,
      userAgent:'',
      browserName:'',
      browserVersion:app.systemInfo.SDKVersion,
      platform:'miniapp',
      deviceType:app.systemInfo.model||"",
      ip:app.globalData.ip||'',
      cookieId:'',
      openId:app.globalData.openid||'',
      userId:app.globalData.single.id||'',
      createTime:this.formatTime(new Date()),
      uploadTime:this.formatTime(new Date()),
      product:config.projectName,
      project:config.houseId,
      eventId:para.eventId||'',//埋点ID
      expand:typeof para.expand==='object'?JSON.stringify(para.expand):para.expand,//扩展字段
      imTalkId:para.imTalkId||'',//IM对话编号
      imTalkType:para.imTalkType||'',//IM对话类型
      eventModuleDes:para.eventModuleDes||'',//模块描述信息
      eventInnerModuleId:para.eventInnerModuleId||'',//事件内部模块信息
      adviserId:para.adviserId||'',//顾问id
      clkDesPage:para.clkDesPage||'',//点击前往的页面名称
      clkId:para.clkId||'',//点击ID
      clkName:para.clkName||'',
      pvId:para.pvId||'',//PV埋点ID
      clkParams:typeof para.clkParams==='object'?JSON.stringify(para.clkParams):para.clkParams,//点击参数
      pvPageStayTime:para.pvPageStayTime||'',
      pvCurPageName:para.pvCurPageName||'',//当前页面名称
      pvCurPageParams:para.pvCurPageParams||'',//当前页面参数
      pvLastPageName:para.pvLastPageName||'',//上一页页面名称
      pvLastPageParams:para.pvLastPageParams||'',//上一页页面参数
      pvPageLoadTime:para.pvPageLoadTime||'',//加载时间
      type:para.type||'',//埋点类型
  }
  let timeNow =new Date().getTime();
  if(timeNow - app.globalData.sessionTime>180000){
      session++;
      wx.setStorageSync('sessionNumber',session)
  }
    data.session = data.userId+'_'+ session;
  wx.request({
  	url:newUrl()+'elab-marketing-system/behavior/miniOrWeb/upload',
  	method:'POST',
  	data:data,
  	success:function(res){
  		console.log(res,'iii')
  	},
  	fail:function(err){
  		console.log(err,'op')
  	}
  })
  app.globalData.sessionTime=timeNow
  console.log(data.session)
}
function trackEventObj(para,app){
  // console.log("app.systemInfo.SDKVersion",app.systemInfo.SDKVersion)
  var initData={
    "uid":app.globalData.openid||"",
    "time":Date.now(), // 
    "phone":app.globalData.phone||"", // 用户手机号
    "type":"20",
    "product":app.globalData.houseid||"", // 109
    "sessionId":app.globalData.sessionKey||"", 
    "project":app.systemInfo.model||""+"_"+app.systemInfo.SDKVersion||"", //小程序基础库版本
    "version":app.systemInfo.version||"", //微信版本
    // "poi_name":"小程序",
    "system":para.system||"4",
    "module":'4',
    "pageid":para.pageid||"",
    "keyvalue":para.keyvalue||"",
    "name":para.name||'',
    "category":para.category||'',
    "value":para.value||'',
  }
  if(para.usetime){
    initData.usetime = para.usetime
  }
  var parameter = {}
  parameter['merchantid'] = '3'
  parameter['version'] = '1'
  parameter['sign_type'] = 'RSA'
  parameter['sign'] = '123'
  parameter['charset'] = 'UTF-8'
  parameter['method'] = "skyforest.analysis.add"
  var context = ''
  for(var key in initData){
    context += '&'+key+'='+initData[key]
  }
  parameter['context'] = context
  return parameter
}
//发送埋点请求
function reqTrackEventObj(obj,app){
  wx.request({
    url:url(),
    method:'POST',
    data: trackEventObj(obj,app),
    success:function(req){
      console.log("***reqTrackEventObj***",req)
    },
    fail:function(req){

    }
  });
}
function shareToken(app){
  wx.request({
      url:newUrl()+'elab-marketing-authentication/share/sign',
      method:'POST',
      data:{customerId:app.globalData.single.id,houseId:config.houseId,userRole:0},
      success:function(res){
        app.globalData.shareToken = res.data.single||"";
      }
  })
}


//发送埋点延时循环请求
function reqTrackEventTimeObj(obj,app){
  if(setIntervalKey)
    clearInterval(setIntervalKey);
  // if(obj.pageid&&obj.keyvalue){
  //   obj.usetime='3000'
  //   // setIntervalKey = setInterval(function(){
  //   //   wx.request({
  //   //     url:url(),
  //   //     method:'POST',
  //   //     data: trackEventObj(obj,app),
  //   //     success:function(req){
  //   //       // console.log("***reqTrackEventTimeObj***",req)
  //   //     },
  //   //     fail:function(req){

  //   //     }
  //   //   })
  //   // },3000)
  // }
}
//
function stopTrackEventTimeObj(obj,app){
  if(setIntervalKey)
    clearInterval(setIntervalKey);
}
function url(path) {
  return config.url;
}
function newUrl(path){
  return config.newUrl
}
//此时此刻日期转化
function timesData(timestamp) {
	var date = new Date(timestamp);
	var Y = date.getFullYear() + '/';
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
	var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
	// var h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
	// var m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
	return Y+M+D;
}
//此时此刻时间转化
function timestampToTime(timestamp) {
	var date = new Date(timestamp);
	var h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
	var m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes());
	return h+m;
}
module.exports = {
  formatTime: formatTime,
  normalTime: normalTime,
  formatTodayTime:formatTodayTime,
  reformParam:reformParam,
  url:url,
  newUrl:newUrl,
  timesData:timesData,
  formatCNTime:formatCNTime,
  timestampToTime:timestampToTime,
  trackRequest:trackRequest,
  getImgUrl:getImgUrl,
  reqTrackEventObj:reqTrackEventObj,
  reqTrackEventTimeObj:reqTrackEventTimeObj,
  stopTrackEventTimeObj:stopTrackEventTimeObj,
  addPoint:"skyforest.analysis.add",
  getModuleList:"skyforest.homehouse.HomeHouseController.getModuleList.v0.93",
  getModuleDetailList:"skyforest.homehouse.HomeHouseController.getModuleDetailList.v0.93",
  getTopPicList:"skyforest.homehouse.HomeHouseController.getTopPicList.v0.93",
  podcastDetails:"skyforest.live.LiveController.podcastDetails.v093",
  accoutUrl:'skyforest.tencent.TencentController.signature',
  podcast:"skyforest.live.LiveController.podcast.v093",
  sendVerifyCode:"skyforest.mine.MineController.sendVerifyCode.v093",
  login:"skyforest.mine.MineController.login.v093",
  insertAppointment:"skyforest.appointment.AppointmentController.insertAppointment.v0.93",
  mineInfo2:"skyforest.mine.MineController.mineInfo.v093",
  mineInfo:"skyforest.appointment.AppointmentController.appointmentDetail.v0.93",
  customerService:"023-62381788",
  podcastList:"skyforest.live.LiveController.podcastList.v093",
  version:"2017033101",
  tokenUrl:'skyforest.mine.MineController.login.v093',
  addCustomerInfo:'MVP_USER_MODIFY',
  adviserList:"skyforest.dynatown.dynatownController.getDynatownList",
  tencentSignature:"skyforest.tencent.TencentController.signature",
  mineLogin:"skyforest.mine.MineController.login.v093",
  aideUrl:"skyforest.live.advisterController.getAdvisterByOnline.v143",
  counselorList:"skyforest.dynatown.dynatownController.getDynatownList",
  chatUrl:'skyforest.dynatown.dynatownController.connect',
  InitUrl:'skyforest-factory.miniprogram.PositionHomeController.getPositionHome',
  historyUrl:'skyforest.dynatown.dynatownController.getAllDynatownList',
  getCustomerNick:'skyforest.dynatown.dynatownController.detail',//获取客户昵称
  likeUrl:'skyforest-factory.miniprogram.RelativeNumberController.insertOrUpdateRelativeNum',
  singleAdviser:'skyforest.dd.DdController.details.v093',//顾问个人详情
  bindAdviser:'skyforest.dynatown.dynatownController.bindAdviser',//绑定用户和顾问
  savephone:'skyforest.autoservice.AutoServiceController.save.v0932',//留电
  verifyCode:'skyforest-factory.controller.message.MessageController.sendSms',//发送验证码
  getPhoneNumber:'skyforest-factory.miniprogram.PositionHomeController.getPhoneNumber',//解码手机号
  checkVerifyCodeEffective:'skyforest-factory.controller.message.MessageController.checkVerifyCodeEffective',//验证验证码
  videoInfo:'skyforest.fixed.FixedController.list.v093',//验证验证码
  connectAdviser:'connectAdviser',
  updateDynatown:'skyforest.advister.updateAdviserStatus.v140',
    videoList:'skyforest.advister.getAllVideoAdviserList',
  getWeather:'skyforest-factory.controller.weather.WeatherController.getWeather',
  getMessageList:'skyforest.message.MessageController.getMessageList',//系统消息列表
  markRead:'skyforest.message.MessageController.markRead',//标记已读
  getPullNewUserList:"skyforest.mine.MineController.getPullNewUserList",//已分享好友
  getRecommendInfoList:"skyforest.apprecommend.AppRecommendController.getRecommendInfoList"//获取推荐信息
}
