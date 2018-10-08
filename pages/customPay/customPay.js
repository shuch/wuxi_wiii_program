import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { randomString, objectToQueryStr } from '../../lib/encrypt';
import MD5 from '../../lib/md5';

const cdn = 'http://oh1n1nfk0.bkt.clouddn.com';

Page({
  data: {
    doShare: false,
    showPopup: false,
    cdn,
    fee: 0.02,
    timelineSrc: '',
  },

  async onLoad(parmas) {
    const openid = 'oUpF8uMuAJO_M2pxb1Q9zNjWeS6o';
    const customerId = 1;
    const houseId = 83;
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
    const nonceStr = randomString(32);
    const timeStamp = String(Date.now());
    const payStr = `prepay_id=${res.single.prepayId}`;
    const signType = 'MD5';
    const params = {
      appId,
      nonceStr,
      package: payStr,
      signType,
      timeStamp,
      key: secret,
    };
    const paySign = MD5(objectToQueryStr(params));
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
          wx.navigateTo({ url: '/pages/customCenter/customCenter' });
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
