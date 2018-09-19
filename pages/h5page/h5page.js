//classify.js
//获取应用实例
var app = getApp()
Page({
    onShareAppMessage: function () {
        return {
            title: '',
            path: '/pages/h5page/h5page'
        }
    },
    data: {
        h5page:'http://www.baidu.com',
    },
    onLoad: function (param) {
        var h5page= wx.getStorageSync('h5page');
        console.log(h5page,'pdf或者视频');
        if(h5page){
            this.setData({
                h5page:h5page
            })
        }

        // wx.setNavigationBarTitle({
        //
        //     title: ''
        // })
    },

})
