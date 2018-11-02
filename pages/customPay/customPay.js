import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { login, getSetting, savePhoneAuth } from '../../lib/promise';
import { trackRequest } from '../../utils/util';

const cdn = 'https://dm.static.elab-plus.com/wuXiW3/img';

const app = getApp(); 
var num = 1
Page({
  data: {
    doShare: false,
    showPopup: false,
    cdn,
    fee: 600,
    timelineSrc: '',
    fromShare: false,
    openSetting: false,
  },

  async onLoad(parmas) {
    console.log({ path: this.route, parmas } );
    const { scene } = parmas;
    let shareId;
    // let fromEntry;
    if (scene) {
      shareId = decodeURIComponent(scene).split('=')[1];;
    } else {
      shareId = parmas.shareId || '';
      // fromEntry = parmas.fromEntry || '';
    }
      app.globalData.shareToken=shareId;

    const appData = await login();

      const pvCurPageParams = {
          shareToken:app.globalData.shareToken
      };
      const param = {
          type: 'PV',
          pvId: 'P_2cdinzhi_2',
          pvCurPageName: 'yudingfuwu',
          pvCurPageParams:pvCurPageParams.shareToken?pvCurPageParams:"{}",
      };
      trackRequest(param);
      num ++
    const {
      houseId,
      nickname,
      id: customerId,
      openId: openid,
      headPortrait: headImage,
    } = appData;
    const { appid: appId, secret } = app.globalData;
    const state = await endpoint('customState', { customerId, houseId });
    const {
      single: {
        customizedStatus,
        paymentStatus,
        customerProgrammeId,
      },
    } = state;
    const hasPay = paymentStatus === 2;
    const fromShare = !!shareId && parseInt(shareId) !== customerId;
    this.setData({
      openid,
      shareId,
      customerId,
      houseId,
      appId,
      secret,
      fromShare,
      hasPay,
      nickname,
      headImage,
      // fromEntry,
    });
    // this.addShareRecord();
    this.redirect();
  },

  async onShow() {
    if(num>1){
        const param = {
            type: 'PV',
            pvId: 'P_2cdinzhi_2',
            pvCurPageName: 'yudingfuwu',
            pvCurPageParams:  {
                shareToken:app.globalData.shareToken
            }
        }
        trackRequest(param);


    };
  },

  redirect() {
    const { hasPay } = this.data;
    if (hasPay) {
      wx.redirectTo({ url: '/pages/customCenter/customCenter' });
    }
  },

  addShareRecord() {
    const { houseId, customerId, shareId } = this.data;
    endpoint('addShare', {
      houseId,
      masterCustomerId: shareId,
      guestCustomerId: customerId,
    });
  },

  onShowPopup() {
    this.setData({ showPopup: true });
  },

  onClose() {
    this.setData({ showPopup: false, doShare: false });
  },

  async onPay(e,flag) {
    const { openid, customerId, houseId, appId, secret, shareId } = this.data;
    let { fee } = this.data;
    const res = await endpoint('buyCard', {
      customerId,
      fee: flag ? 300 : 600,
      houseId,
      orderSubject: "无锡WIII公寓户型定制入场券",
      payPlatform: 1,
      paySource: 1,
      uniqueCode: openid,
      shareCustomerId: shareId,
    });
    if (!res.success) {
      wx.showToast({ title: res.message, icon: 'none' });
      return;
    }
    const { 
      nonceStr,
      paySign,
      prepayId,
      signType,
      timeStamp,
    } = res.single;
    const payStr = `prepay_id=${prepayId}`;
    wx.requestPayment({
       timeStamp,
       nonceStr,
       package: payStr,
       signType,
       paySign,
       success: () => {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          });
          wx.navigateTo({ url: '/pages/customCenter/customCenter' });
       },
       fail: () => {
          wx.showToast({
            title: '支付失败',
            icon: 'fail',
            duration: 2000
          });
       }
    });
    if(flag){
        trackRequest({
            type: 'CLK',
            clkName: 'xiangshoujianmian',
            clkId: 'clk_2cdinzhi_15',
        });
    }else{
        trackRequest({
            type: 'CLK',
            clkName: 'zhijiefukuan',
            clkId: 'clk_2cdinzhi_14',
        });
    }
  },

  async menuShare() {
    const { nickname, headImage, houseId, customerId } = this.data;
    const path = this.route;
    const scene = `shareId=${customerId}`;
    const res = await endpoint('poster', {
      head: headImage,
      houseId,
      name: nickname,
      path,
      scene,
      width: 185,
      type: 2,
      xcxName: "无锡WIII",
    });
    this.setData({ doShare: true, timelineSrc: res.single });
    trackRequest({
      type: 'CLK',
      clkName: 'xiangshoujianmian',
      clkId: 'clk_2cdinzhi_15',
    });
  },

  onShareAppMessage() {
    const { customerId, hasPay } = this.data;
    const imageUrl = `${cdn}/share_pay.jpg`;
    setTimeout(() => {
        this.sharePay();
    }, 2000);
    return {
      title: '我邀请你一起来抢限量入场券,享无锡WIII公寓户型定制',
      imageUrl,
      path: `${this.route}?shareId=${customerId}&from=customPay`,
      success: () => {
        console.log('success');
      },
    };
  },

  onShareFriend() {
    console.log('onShareFriend');
    this.sharePay();
  },

  async onSaveImage() {
    const setting = await getSetting();
    if (setting['scope.writePhotosAlbum']) {
      this.savePhoto();
      return;
    }
    wx.showToast({ title: '暂无权限，点击授权后可保存图片', icon: 'none' });
    const authRes = await savePhoneAuth();
    if (authRes) {
      this.savePhoto();
    } else {
      this.setData({ openSetting: true });
    }
  },

  handleSetting(e) {
    const { detail } = e.detail;
    if (!detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '若不打开授权，则无法将图片保存在相册中！',
        showCancel: false
      })
      this.setData({
        openSetting: true,
      })
    } else{
      wx.showModal({
        title: '提示',
        content: '您已授权，赶紧将图片保存在相册中吧！',
        showCancel: false
      })
      this.setData({
        openSetting: false,
      })
    }
  },

  savePhoto() {
    const that = this;
    const { timelineSrc, hasPay } = this.data;
    wx.downloadFile({
      url: timelineSrc,
      success: function (res) {
        const path = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: () => {
            wx.showToast({
              title: '保存成功',
            });
            that.sharePay();
          },
          fail: (e) => {
            console.log(e);
          }
        });
      },
    });
  },

  sharePay() {
    const { hasPay } = this.data;
    this.setData({ fee: 300, doShare: false });
    if (hasPay) {
      return;
    }
    this.onPay(null,true);
  },

  onRouteCustom() {
    wx.navigateTo({ url: '/pages/index/index' });
  },

  onRouteService() {
    const { houseId } = this.data;
    const isSend = wx.getStorageSync(`isSend${houseId}`);
    let url;
    if (!isSend) {
      url = '../counselorList/counselorList'
    } else {
      url = '../messagesList/messagesList'
    }
    wx.navigateTo({ url });
  },

});
