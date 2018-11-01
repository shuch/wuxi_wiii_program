import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { login } from '../../lib/promise';
import { trackRequest } from '../../utils/util';

const cdn = 'https://dm.static.elab-plus.com/wuXiW3/img';

const app = getApp(); 

Page({
  data: {
    doShare: false,
    showPopup: false,
    cdn,
    fee: 0.5,
    timelineSrc: '',
    fromShare: false,
  },

  async onLoad(parmas) {
    console.log({ path: this.route, parmas } );
    const { scene } = parmas;
    let shareId;
    // let fromEntry;
    if (scene) {
      shareId = scene.shareId;
    } else {
      shareId = parmas.shareId || '';
      // fromEntry = parmas.fromEntry || '';
    }
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

  onShow() {
    const param = {
      type: 'PV',
      pvId: 'P_2cdinzhi_2',
      pvCurPageName: 'yudingfuwu',
    };
    trackRequest(param);
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

  async onPay() {
    const { openid, customerId, houseId, appId, secret, fee, shareId } = this.data;
    const res = await endpoint('buyCard', {
      customerId,
      fee,
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
    trackRequest({
      type: 'CLK',
      clkName: 'zhijiefukuan',
      clkId: 'clk_2cdinzhi_14',
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
      },
    });
  },

  sharePay() {
    const { hasPay } = this.data;
    this.setData({ fee: 1, doShare: false });
    if (hasPay) {
      return;
    }
    this.onPay();
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
