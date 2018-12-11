var util = require('../../utils/util.js')

var app = getApp()
var config = require('../../config.js')
var { authorizeInfo, getUserInfo } = require('../../getlogininfo.js')
var serverUrl = 'http://skyforest.static.elab-plus.com/wepy_pro/';
var pvCurPageParams = null;

Page({
    data:{
        view:"",
        // parm:"",
        encodeView:"",
        loginid:"",
        linkUrl:"",
        despage:'',
        title:"",
        isMomentPage:false,
        imgUrl:""
    },
    onShareAppMessage(options) {
        let param = {
            clkId:'clk_2cMINA_1',
            clkDesPage:'',//点击前往的页面名称
            clkName:'fenxiang',//点击前往的页面名称
            type:'CLK',//埋点类型
            pvCurPageName:app.globalData.currDespage||'',//当前页面
            pvCurPageParams:pvCurPageParams,//当前页面参数
        }
        util.trackRequest(param,app)
        return {
            imageUrl:app.globalData.shareImage||'',
            title: this.data.title||app.globalData.projectName,
            path: '/pages/webView/webView?shareToken='+app.globalData.shareToken+"&view="+this.data.encodeView+'&title='+this.data.title
        }
    },
    onLoad:function(options){
        wx.showLoading({
            title: '正在加载',
        })
        pvCurPageParams = JSON.stringify(options)
        if(options.shareToken){
            app.globalData.fromChannel = options.shareToken || '';
        }
        if(options.title){
            this.setData({
                title:options.title||app.globalData.projectName
            })
        }
        var newUrl="";
        if(options.momentId){
            this.setData({
                isMoment:options.momentId
            })
        }
        if(options.q){ // 针对模板H5的逻辑调整
            var myquery=decodeURIComponent(options.q);
            var last=myquery.substring(myquery.lastIndexOf('/')+1,myquery.length) //app.globalData.templateUrl
            if(last.startsWith("N")||last.startsWith("n")){
                newUrl= config.newTemplateUrl+last.replace("N","");
            }
            else{
                // newUrl= "https://m.elab-plus.com/launch/#/pages/preview?projectId="+last;//_request.QueryString('projectId');
                newUrl= config.templateUrl+last;//_request.QueryString('projectId');
            }
            console.log("======options.q******",options.q,myquery,newUrl)
        }
        else{
            newUrl = decodeURIComponent(options.view);
            console.log(newUrl,options.view,'转发的url')
        }
        if(newUrl.indexOf('https')==-1){
            newUrl = newUrl.replace('http','https');
        }
        newUrl =newUrl.includes("?fromProduce=xcx")?newUrl:(newUrl.includes("?")?(newUrl.replace('?','?fromProduce=xcx&')):(newUrl+'?fromProduce=xcx'))
        this.setData({
            view:newUrl,
            encodeView: options.view||encodeURIComponent(newUrl)||"",
            linkUrl:options.linkUrl||"",
            // parm:decodeURIComponent(options.encodePram)||"",
            imgUrl:options.imgUrl||"",
            loginid:options.shareToken||app.globalData.shareToken||""
        })
        console.log("***WebView Data***",this.data,options.shareToken,"***",app.globalData.shareToken)
        // wx.showToast({
        //   title: this.data.loginid,
        //   icon: 'none',
        //   duration: 1500,
        // })
    },
    // 对界面内容进行设置的 API 如wx.setNavigationBarTitle，请在onReady之后进行。
    onReady:function(){
        wx.hideLoading();
        // 页面渲染完成
        this.setData({
            despage:app.globalData.currDespage
        })
        wx.setNavigationBarTitle({
            title: this.data.title
        });
    },
    onShow:function(){
        // 页面显示
        app.login(function(){
            console.log("***webview-onshow-app.login***")
        });
    },
    onHide:function(){
        // 页面隐藏
        app.globalData.currDespage = null;
    },
    onUnload:function(){
        // 页面关闭
        // console.log("onUnload")
        // 停止当前页面的计时
        console.log(this.data.isMoment, 'webview-onUnload-ppppp')
        // util.stopTrackEventTimeObj();
        // if (this.data.isMoment) {
        //  wx.request({
        //    url: util.newUrl() + 'elab-marketing-content/module/modifyMomentView',
        //    method: 'POST',
        //    data: {
        //      id: this.data.isMoment,
        //      viewNumber: -1
        //    },
        //    success: function (res) {
        //    }
        //  })
        // }

        // var data={
        //   houseId: app.globalData.houseid,
        //   picUrl:  this.data.linkUrl,
        //   numberType: '2', // 数字类型(1点赞数|2观看数|3点击数)
        //   status:"-1", // 1观看，-1 不观看
        //   uniqueId: app.globalData.openid,
        // }
        // wx.request({
        //   url: util.url(),
        //   method: 'POST',
        //   data: util.reformParam(util.likeUrl, data),
        //   header: {
        //     'content-type': 'application/json' // 默认值
        //   },
        //   success:function(res){
        //     if(res.data.success && res.data.single){
        //     }
        //     else{
        //     }
        //   }
        // })
    }
})