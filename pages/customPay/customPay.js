import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { randomString, objectToQueryStr } from '../../lib/encrypt';
import MD5 from '../../lib/md5';

const cdn = 'http://oh1n1nfk0.bkt.clouddn.com';

Page({
  data: {
    showPopup: false,
    cdn,
  },

  async onLoad(parmas) {
    const openid = 'oUpF8uMuAJO_M2pxb1Q9zNjWeS6o';
    const customerId = 1;
    const houseId = 83;
    const appId = "wx393fa65352d1b735";
    const secret = "bda6d7952104872c35239fb6ce751ce1";
    this.setData({ openid, customerId, houseId, appId, secret });
  },

  onShowPopup() {
    this.setData({ showPopup: true });
  },

  onClose() {
    this.setData({ showPopup: false });
  },

  async onPay() {
    const { openid, customerId, houseId, appId, secret } = this.data;
    const res = await endpoint('buyCard', {
      customerId,
      fee: 0.01,
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
       success: (res) => {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
       },
       fail: (res) => {
          wx.showToast({
            title: '失败',
            icon: 'success',
            duration: 2000
          })
       }
    });
  },

});
