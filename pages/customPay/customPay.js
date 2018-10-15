import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { login } from '../../lib/promise';

const cdn = 'http://oh1n1nfk0.bkt.clouddn.com';

const app = getApp(); 

Page({
  data: {
    doShare: false,
    showPopup: false,
    cdn,
    fee: 0.02,
    timelineSrc: '',
    fromShare: false,
  },

  async onLoad(parmas) {
    const { shareId } = parmas;
    const appData = await login();
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
    // const timelineSrc = `${cdn}/space_type.png`;
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
    });
    this.addShareRecord();
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
    this.setData({ showPopup: false });
  },

  async onPay() {
    const { openid, customerId, houseId, appId, secret, fee } = this.data;
    const res = await endpoint('buyCard', {
      customerId,
      fee,
      houseId,
      orderSubject: "无锡WIII公寓户型定制入场券",
      payPlatform: 1,
      paySource: 1,
      uniqueCode: openid,
    });
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
  },

  onShareAppMessage() {
    const { customerId, hasPay } = this.data;
    const imageUrl = `${cdn}/share_pay.jpg`;
    return {
      title: '我邀请你一起来抢限量入场券,享无锡WIII公寓户型定制',
      imageUrl,
      path: `${this.route}?shareId=${customerId}&from=customPay`,
      success: () => {
        this.sharePay();
      },
    };
  },

  onSaveImage() {
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
        // wx.authorize({
        //   scope: 'scope.writePhotosAlbum',
        //   success: () => {
        //   }
        // });
      },
    });
  },

  sharePay() {
    const { hasPay } = this.data;
    this.setData({ fee: 0.01, doShare: false });
    if (hasPay) {
      return;
    }
    this.onPay();
  },

  onRouteCustom() {
    wx.navigateTo({ url: '/pages/customHouse/customHouse' });
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
