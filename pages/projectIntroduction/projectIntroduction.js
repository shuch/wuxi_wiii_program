var util = require('../../utils/util.js')
var app = getApp()
var config = require('../../config.js')
var serverUrl = 'https://dm.static.elab-plus.com/wuXiW3/projectIntroduction/'
Page({
    data:{
        serverUrl:serverUrl,
    },
    onShow: function(e){
        wx.setNavigationBarTitle({
            title: '项目介绍'
        })
    },
    onShareAppMessage(options) {
        return {
            title: '项目介绍',
            path: '/pages/projectIntroduction/projectIntroduction'
        }
    },
    toDiy(){
        wx.navigateTo({ url: '/pages/customCenter/customCenter' });
    },
    onUnload(){
    },
    onHide(){
    },

    onLoad:function(options) {
    }
})