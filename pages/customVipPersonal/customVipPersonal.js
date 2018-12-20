import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { login } from '../../lib/promise';

const cdn = 'http://pjrpw22gp.bkt.clouddn.com';

Page({
  data: {
    cdn,
  },

  async onLoad() {
    const user = await login();
    console.log('user', user);
    const { id: customerId, houseId, openId } = user;
    this.setData({ customerId, houseId, openId });
    this.getPayAmount();
  },

  async getPayAmount() {
    const res = await endpoint('payAmount');
    const { customizedService, customizedServiceName } = res.single;
    this.setData({ fee: customizedService, subject: customizedServiceName });
  },

  async onPay() {
    const { customerId, fee, houseId, openId, subject } = this.data;
    const res = await endpoint('buyCard', {
      customerId,
      fee,
      houseId,
      orderSubject: subject,
      payPlatform: 1,
      paySource: 1,
      shareCustomerId: 0,
      uniqueCode: openId,
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
  },
})