var util = require('../../utils/util.js')
var app = getApp()
var serverUrl = util.getImgUrl();

Page({
  data:{
      type:'',
    imgTotal:[
        {
            imgList: [{
                    title:'实景01',
                    text:'位于北外滩的高端住宅楼，比邻黄浦江',
                    url:serverUrl+'wepy_pro/v1-2/houseType/1.png'
                },
                {
                    title:'实景02',
                    text:'位于北外滩的高端住宅楼，比邻黄浦江',
                    url:serverUrl+'wepy_pro/v1-2/houseType/2.png'
                }
                ],
            type:'photography'
        },
        {
            imgList: [{
                title:'样板间01',
                text:'位于北外滩的高端住宅楼，比邻黄浦江',
                url:serverUrl+'wepy_pro/v1-2/houseType/3.png'
            },
                {
                    title:'样板间02',
                    text:'位于北外滩的高端住宅楼，比邻黄浦江',
                    url:serverUrl+'wepy_pro/v1-2/houseType/4.png'
                }
            ],
            type:'showroom'
        },
        {
            imgList: [{
                title:'效果01',
                text:'位于北外滩的高端住宅楼，比邻黄浦江',
                url:serverUrl+'wepy_pro/v1-2/houseType/5.png'
            },
                {
                    title:'效果02',
                    text:'位于北外滩的高端住宅楼，比邻黄浦江',
                    url:serverUrl+'wepy_pro/v1-2/houseType/6.png'
                }
            ],
            type:'render'
        },
    ],
      currentType:{}
  },
    // onShareAppMessage(options) {
    //     return {
    //         title: '实景美图',
    //         path: '/pages/imgSwip/imgSwip?shareToken='+app.globalData.shareToken+'&type='+this.data.type
    //     }
    // },
  onLoad:function(options){
      if(options.shareToken){
          app.globalData.fromChannel = options.shareToken
      }
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options.type);
    if(options.type=='render'){
        this.setData({
            currentType:this.data.imgTotal[2]
        })
    }else if(options.type=='photography'){
        this.setData({
            currentType:this.data.imgTotal[0]
        })
    }else {
        this.setData({
            currentType:this.data.imgTotal[1]
        })
    }
      this.setData({
          type:options.type
      })
    var src = this.data.currentType.imgList[0].url;
    var list = [];
    this.data.currentType.imgList.forEach(function(item,index){
        list.push(item.url)
    })
    console.log(this.data.currentType,'====type')
      wx.previewImage({
          current: src,
          // 当前显示图片的http链接
          urls: list,
          // 需要预览的图片http链接列表
          success: function(e) {
              console.log(e)
          }
      })
  },
  onReady:function(){
    // 页面渲染完成

    
  },
  onShow:function(){
    // 页面显示
    
  },
  onHide:function(){
    // 页面隐藏
    
  },
  onUnload:function(){
    // 页面关闭
    
  }
})