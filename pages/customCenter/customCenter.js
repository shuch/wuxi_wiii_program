import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { login } from '../../lib/promise';
import { rankMapper, customizedMapper } from '../../utils/convertor';

const cdn = 'http://oh1n1nfk0.bkt.clouddn.com';

Page({
  data: {
    cdn,
    doShare: false,
    showIntro: false,
    showProgress: false,
    showRefund: false,
    selectedReason: '',
    fee: 0.02,
    shareCustomId: 0,
    appId: "wx5e18485e35c5f1f6",
    secret: "6ac2abb378f4d5a5d16b7c6ba2850807",
    endTime: {
      d: 30,
      h: 12,
    },
  },

  async onLoad(parmas) {
    const appData = await login();
    const { id: customerId, houseId, openId: openid } = appData;
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
    const res = await endpoint('customizedList', {
      customerId,
      houseId,
    });

    const rankRes = await endpoint('rankList', {
      houseId,
      pageNo: 1,
      pageSize: 10,
    });
    let rankList = rankRes.pageModel ? rankRes.pageModel.resultSet : [];
    rankList = rankList.map(rankMapper);
    this.setData({
      hasPay,
      customList: res.list.map(customizedMapper),
      refundResons,
      houseId,
      customerId,
      timelineSrc,
      rankList,
      openid,
    });
    if (hasPay) {
      const payRes = await endpoint('ticket', { customerId, houseId });
      const {
        ticket: {
          payTime,
          ticketViewCode,
          fee: payFee,
          tradeCode,
        },
        customerList: inviteList,
      } = payRes.single;
      // const inviteRes = await endpoint('invite', { customerId, houseId });
      console.log('payRes', payRes);
      this.setData({ payTime, ticketViewCode, payFee, tradeCode, inviteList });
    }

    const time = await endpoint('restTime', houseId);
    const { endTime } = time.single;
    // console.log('time', time);
    // const date = getRestTime(endTime);

  },

  getRestTime(endTime) {
    const { createTime } = this.data.detail;
    const nowtime = Date.now();
    const endtime = createTime + 6 * 60 * 60 * 1000;
    const lefttime = parseInt((endtime - nowtime) / 1000);
    let h = parseInt(lefttime / (60 * 60) % 24);
    let m = parseInt(lefttime / 60 % 60);
    let s = parseInt(lefttime % 60);

    if (h + s + m <= 0) {
      console.log('timer end', this.timer);
      clearInterval(this.timer);
      this.timer = null;
      return;
      // await this.fetchGroupDetail(this.redEnvelopId);
      // this.initData();
      // return;
    }

    h = this.addZero(h);
    m = this.addZero(m);
    s = this.addZero(s);

    this.setData({ endTime: { h, m, s } });
  },

  async onReady() {
    const { houseId } = this.data;
  },

  async changePay() {
    const { customerId, houseId } = this.data;
    const res = await endpoint('ticket', { customerId, houseId });
    const {
      ticket: {
        payTime, ticketViewCode, fee: payFee, tradeCode
      },
      customerList: inviteList,
      } = res.single;
    // const inviteRes = await endpoint('invite', { customerId, houseId });
    console.log('vi', inviteRes);
    this.setData({ payTime, ticketViewCode, payFee, tradeCode, inviteList });
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

  async didRefund() {
    const { customerId, houseId, payFee, tradeCode } = this.data;
    const res = await endpoint('refund', {
      customerId,
      houseId,
      payPlatform: 1,
      refundFee: payFee,
      tradeCode,
    });
    console.log('res', res);
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
          this.changePay();
          this.setData({ hasPay: true });
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
    this.setData({ fee: 0.01, doShare: false });
    this.onPay();
  },

  createCustom() {
    const url = `/pages/customHouse/customHouse?create=1`
    wx.navigateTo({ url });
  },

  onEdit(e) {
    const id = e.currentTarget.dataset.id;
    const url = `/pages/customHouse/customHouse?update=1&id=${id}`;
    wx.navigateTo({ url });
  },

  onShare(e) {
    const id = e.currentTarget.dataset.id;
    // 获取定制方案详情的海报
    const customTimelineSrc = 'http://oh1n1nfk0.bkt.clouddn.com/house_type_plane.png';
    this.setData({ shareCustomId: id, doShare: true, timelineSrc: customTimelineSrc });
  }
});
