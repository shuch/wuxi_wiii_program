var util = require('../../utils/util.js')
var config = require('../../config.js')
var app = getApp()
var serverUrl = util.getImgUrl();
Page({
  data:{
      // flag:true,  //防止重复提交，保证处理完毕后才能再次请求
      scaleWidth:"",
      scaleHeight:"",
      dataimg:"",
      gradient1:'#3A4A80',
      gradient2:'#6294A6',
      swipIndex:0,
      despage:'tupianku',
      title:'tupianku',
      likeImg:serverUrl+'wepy_pro/v1-2/Thumbup@2x.png',
      likeImgRed:serverUrl+'wepy_pro/v1-2/Thumbup-red.png',
      isChosed:1,
      imgTotal:[],
      currentType:{}
  },
    likeAdd:function(e){
      let that = this;
      let tmpTotal = that.data.imgTotal;
      var likeflag= false;//e.currentTarget.data.like;
      // 不能直接使用view层的这个值e.currentTarget.data.like，在快速改变该值的时候，由于微信小程序的双向绑定机制，会出现脏数据(绑定存在时差) by zjs
      tmpTotal.forEach(function(item){
         if(item.groupType==e.currentTarget.dataset.type){
             item.atlasResponseList.forEach(function(item){
                 if(item.id==e.currentTarget.dataset.id){
                    likeflag = item.like;
                 }
             })
         }
      })
      // 已经点赞的，不允许取消点赞
      if(likeflag == true){
        return false;
      }
      console.log("that.data.flag:",that.data.flag,likeflag);
      if(that.data.flag==false){
        return false;
      }
      that.data.flag = false;
      console.log("that.data.flag:",that.data.flag,likeflag);
      wx.request({
          url:util.newUrl()+'elab-marketing-content/atlas/updateLike',
          method:'POST',
          data:{
              "appVersion":"",
              "authToken":"",
              "environment":"3",
              "houseId":config.houseId,
              "imageId":e.currentTarget.dataset.id,
              "imageType":e.currentTarget.dataset.type,
              "like":likeflag==true?-1:1,
              "openId":app.globalData.openid,
              "uid":""
          },
          success:function (res) {
              tmpTotal.forEach(function(item){
                 if(item.groupType==e.currentTarget.dataset.type){
                     item.atlasResponseList.forEach(function(item){
                         if(item.id==e.currentTarget.dataset.id){
                            console.log("item.likeNumber:",item.likeNumber,likeflag,item.like)
                             item.likeNumber=item.likeNumber+(likeflag==true?-1:1)
                             item.like = !likeflag; //
                         }
                     })
                 }
              })
              that.setData({
                  imgTotal:tmpTotal,
                  flag:true
              })
              console.log(that.data.imgTotal)
              tmpTotal.forEach(function(item){
                  if(item.groupType==e.currentTarget.dataset.type){
                      that.setData({
                          currentType:item
                      })
                  }
              })
              console.log(that.data.currentType)
              let param={
                  pvCurPageName:that.data.title||'',//当前页面名称
                  clkId:'clk_2cmina_37',//点击ID
                  clkParams:{"imageCode":e.currentTarget.dataset.id},//点击参数
                  clkName:'dianzan',
                  type:'CLK',//埋点类型
              }
              util.trackRequest(param,app)
          }
      })
    },
    selectTap:function(e){
      switch(e.currentTarget.dataset.type){
          case 1:
              var real_view='xiaoguotu';
              break;
          case 2:
              var real_view='yangbanjiantu';
              break;
          case 3:
              var real_view='shijingtu';
              break;
          case 4:
              var real_view='peitaotu';
              break;
      }
      var that = this;
      console.log(e.currentTarget.dataset.type)
      this.setData({
          swipIndex:0,
          isChosed:e.currentTarget.dataset.type,
      })
        console.log(this.data.imgTotal)
        this.data.imgTotal.forEach(function (item) {
            if(item.groupType==e.currentTarget.dataset.type){
                console.log(item)
                that.setData({
                    currentType:item
                })
            }

        })
        let param={
            pvCurPageName:'tupianku',//当前页面名称
            clkId:'clk_2cmina_38',//点击ID
            clkName:'tupiankuleixing',//点击ID
            clkParams:{"imageCode":this.data.currentType.atlasResponseList[this.data.swipIndex].id,
                real_view:real_view,buttonType:'show_rooom'},//点击参数
            type:'CLK',//埋点类型
        }
        util.trackRequest(param,app)
        console.log(that.data.currentType)
    },
  onLoad:function(options){
      var that = this;
      console.log(options.type);
      wx.request({
          url:util.newUrl()+'elab-marketing-content/atlas/listGroup',
          method:'post',
          data:{
          "appVersion":"",
          "authToken":"",
          "environment":"",
          "houseId":config.houseId,
          "openId":app.globalData.openid,
          "uid":""
          },
          success:function(res){
              that.setData({
                  imgTotal:res.data.list
              })
              if(options.type){
                  that.data.imgTotal.forEach(function(item){
                      if(item.groupType==options.type){
                          that.setData({
                              currentType:item,
                              isChosed:options.type
                          })
                      }
                  })
              }
              console.log(that.data.currentType,'PPPPPPPPPPPPPPPPPPP')
          }
      })
  },
  onReady:function(){
    // 页面渲染完成
  },
    previewImage: function (e) {
        var current = e.target.dataset.src;
        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: [e.target.dataset.src] // 需要预览的图片http链接列表
        })
    } ,
    onShow:function(){
      wx.setStorageSync('loadTime',new Date().getTime())
      console.log('路由',getCurrentPages())
    // 页面显示
      let param={
          pvId:'P_2cMINA_14',
          pvCurPageName:this.data.despage||'',//当前页面名称
          pvCurPageParams:'',//当前页面参数
          pvLastPageName:'zhuye',//上一页页面名称
          pvLastPageParams:'',//上一页页面参数
          pvPageLoadTime:new Date().getTime()-wx.getStorageSync('loadTime') ,//加载时间
          type:'PV',//埋点类型
      }
      util.trackRequest(param,app)
        wx.setNavigationBarTitle({
            title: '图片库'
        })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
      let param={
          pvPageStayTime:(new Date().getTime()-wx.getStorageSync('loadTime'))/1000,
          pvCurPageName:this.data.despage||'',//当前页面名称
          clkDesPage:'zhuye',//点击前往的页面名称
          clkName:'fanhui',//点击前往的页面名称
          clkId:'clk_2cmina_36',//点击ID
          clkParams:{"imageCode":this.data.currentType.atlasResponseList[this.data.swipIndex].id},//点击参数
          type:'CLK',//埋点类型
      }
      util.trackRequest(param,app)

  }
})