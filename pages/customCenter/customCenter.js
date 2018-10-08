import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { randomString, objectToQueryStr } from '../../lib/encrypt';
import MD5 from '../../lib/md5';

const cdn = 'http://oh1n1nfk0.bkt.clouddn.com';
// 总定制
// 0-未定制 未支付
// 1-已定制 未支付
// 2-已定制 已支付
// 3-未定制 已支付（直接购买入场券）
const customState = 2;

const customList = [
  {
    id: 1,
    imgSrc: `${cdn}/rank_custom_img.png`,
    num: 1,
    like: 10,
    special: ['户型A','私人影院','景观小餐厅'],
    editDate: '2018-12-05',
    rank: 10,
  },
  {
    id: 2,
    imgSrc: `${cdn}/rank_custom_img.png`,
    num: 2,
    like: 2,
    special: ['户型A','私人影院','景观小餐厅'],
    editDate: '2018-12-15',
    rank: 2,
  },
];

const rankList = [
  {
    id: 1,
    src: `${cdn}/rank_star.png`,
    like: 1012,
    avatar: `${cdn}/rank_star_avatar.png`,
    name: '行云流水'
  },
  {
    id: 2,
    src: `${cdn}/rank_star.png`,
    like: 842,
    avatar: `${cdn}/rank_star_avatar.png`,
    name: '世纪花园'
  },
  {
    id: 3,
    src: `${cdn}/rank_star.png`,
    like: 541,
    avatar: `${cdn}/rank_star_avatar.png`,
    name: '马云'
  },
];

Page({
  data: {
    cdn,
    doShare: false,
    showIntro: false,
    showProgress: false,
    showRefund: false,
    selectedReason: '',
    fee: 0.01,
    shareCustomId: 0,
    appId: "wx393fa65352d1b735",
    secret: "bda6d7952104872c35239fb6ce751ce1",
    openid: 'oUpF8uMuAJO_M2pxb1Q9zNjWeS6o',
  },

  async onLoad(parmas) {
    const customerId = 1;
    const houseId = 83;
    const timelineSrc = `${cdn}/space_type.png`;
    const state = await endpoint('customState', { customerId, houseId });
    const {
      single: {
        customizedStatus,
        paymentStatus,
        customerProgrammeId,
      },
    } = state;
    const hasPay = paymentStatus;
    const refundResons = ['我不想要了','设计不满意','其他原因'];
    this.setData({
      hasPay,
      customList,
      refundResons,
      houseId,
      customerId,
      timelineSrc,
      rankList,
    });
  },

  onShareAppMessage() {
    const { customerId, hasPay, shareCustomId } = this.data;
    // 分享定制方案
    if (shareCustomId) {
      return {
        title: '户型方案',
        path: `/pages/customDetail/customDetail?shareId=${customerId}&from=customCenter`,
        success: () => {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 2000
          });
          this.setData({ doShare: false, shareCustomId: 0 });
        },
      };
    }
    return {
      title: '户型定制入场券',
      path: `/pages/customPay/customPay?shareId=${customerId}&from=customCenter`,
      success: () => {
        if (!hasPay) {
          this.onSharePay();
        }
        this.setData({ doShare: false });
      },
    };
  },

  showIntro() {
    this.setData({ showIntro: true });
  },

  hideIntro() {
    this.setData({ showIntro: false });
  },

  didShowProgress() {
    this.setData({ showProgress: true });
  },

  onRefund() {
    this.setData({ showProgress: false, showRefund: true });
  },

  selectReason(e) {
    this.setData({ selectedReason: e.currentTarget.dataset.id });
  },

  didRefund() {
    this.setData({ showRefund: false });
  },

  cancelRefund() {
    this.setData({ showRefund: false });
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
          this.setData({ hasPay: true });
       },
       fail: () => {
          wx.showToast({
            title: '支付失败',
            icon: 'fail',
            duration: 2000
          });
          this.setData({ hasPay: true });
       }
    });
  },

  onSaveImage() {
    const that = this;
    const { timelineSrc, hasPay, shareCustomId } = this.data;
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
                if (!hasPay && !shareCustomId) {
                  that.onSharePay();
                }
                // const data = { doShare: false };
                // if (shareCustomId) {
                //   Object.assign(data, { timelineSrc });
                // }
                that.setData({ doShare: false });
                wx.showToast({
                  title: '保存成功',
                });
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

  menuShare() {
    // 获取支付页面的海报
    const timelineSrc = `${cdn}/space_type.png`;
    this.setData({ doShare: true, timelineSrc });
  },

  onSharePay() {
    this.setData({ fee: 0.02, doShare: false });
    this.onPay();
  },

  createCustom() {
    const url = `/pages/customHouse/customHouse?create=true`
    wx.navigateTo({ url });
  },

  onEdit(e) {
    const id = e.currentTarget.dataset.id;
    const url = `/pages/customHouse/customHouse?customHouseId=${id}`;
    wx.navigateTo({ url });
  },

  onShare(e) {
    const id = e.currentTarget.dataset.id;
    // 获取定制方案详情的海报
    const customTimelineSrc = 'http://oh1n1nfk0.bkt.clouddn.com/house_type_plane.png';
    this.setData({ shareCustomId: id, doShare: true, timelineSrc: customTimelineSrc });
  }
});
