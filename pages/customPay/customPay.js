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
    fee: 0.01,
    timelineSrc: '',
  },

  async onLoad(parmas) {
    const appData = await login();
    const { id: customerId, houseId, openId: openid } = appData;
    const appId = "wx393fa65352d1b735";
    const secret = "bda6d7952104872c35239fb6ce751ce1";
    const timelineSrc = `${cdn}/space_type.png`;
    this.setData({ openid, customerId, houseId, appId, secret, timelineSrc });
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

  menuShare() {
    this.setData({ doShare: true });
  },

  onShareAppMessage() {
    console.log('onShareAppMessage', this.route);
    return {
      title: '户型定制入场券',
      path: `${this.route}?from=customPay`,
      success: () => {
        this.sharePay();
      },
    };
  },

  onSaveImage() {
    const that = this;
    const { timelineSrc } = this.data;
    wx.downloadFile({
      url: timelineSrc,
      success: function (res) {
        const path = res.tempFilePath;
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: () => {
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
          }
        });
      },
    });
  },

  sharePay() {
    this.setData({ fee: 0.02, doShare: false });
    this.onPay();
  },

});
