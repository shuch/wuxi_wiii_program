import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { login } from '../../lib/promise';
import { rankMapper, customizedMapper, processMapper } from '../../utils/convertor';
import { formatDateTs } from '../../utils/date';

const cdn = 'http://oh1n1nfk0.bkt.clouddn.com';
const app = getApp(); 

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
    endTime: {
      d: 30,
      h: 12,
    },
    showCustomPop: false,
  },

  async onLoad(parmas) {
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
    const refundResons = ['我不想要了','设计不满意','其他原因'];
    const res = await endpoint('customizedList', {
      customerId,
      houseId,
    });

    const rankRes = await endpoint('rankList', {
      houseId,
      pageNo: 1,
      pageSize: 10,
      customerId,
    });
    let rankList = rankRes.pageModel ? rankRes.pageModel.resultSet : [];
    rankList = rankList.map(rankMapper);
    console.log('rankList', rankList);
    const customList = res && res.list ? res.list.map(customizedMapper) : [];
    const showCustomPop = !customizedStatus && hasPay;
    this.setData({
      hasPay,
      customList,
      refundResons,
      houseId,
      customerId,
      // timelineSrc,
      rankList,
      openid,
      showCustomPop,
      nickname,
      headImage,
      appId,
      secret,
    });

    if (hasPay) {
      const payRes = await endpoint('ticket', { customerId, houseId });
      const {
        ticket: {
          payTime,
          ticketViewCode,
          fee: payFee,
          tradeCode,
          process: payProcess,
        },
        customerList: inviteList,
      } = payRes.single;
      this.setData({
        payTime: formatDateTs(payTime),
        ticketViewCode,
        payFee,
        tradeCode,
        inviteList,
        payProcess,
      });
    }

    // const time = await endpoint('restTime', houseId);
    // const { endTime } = time.single;
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
        payTime,
        ticketViewCode,
        fee: payFee,
        tradeCode,
      },
      customerList: inviteList,
    } = res.single;
    // const inviteRes = await endpoint('invite', { customerId, houseId });
    // console.log('vi', inviteRes);
    this.setData({ payTime, ticketViewCode, payFee, tradeCode, inviteList });
  },

  onShareAppMessage() {
    const { customerId, hasPay, shareCustomId } = this.data;
    // 分享定制方案
    if (shareCustomId) {
      return {
        title: '户型方案',
        path: `/pages/customDetail/customDetail?shareId=${customerId}&customId=${shareCustomId}`,
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

  async didShowProgress() {
    const { customerId, houseId } = this.data;
    const res = await endpoint('customStatus', { customerId, houseId });
    const progress = res.single.processList.map(processMapper);
    this.setData({ showProgress: true, progress });
  },

  onRefund() {
    this.setData({ showProgress: false, showRefund: true });
  },

  selectReason(e) {
    this.setData({ selectedReason: e.currentTarget.dataset.id });
  },

  async didRefund() {
    const { customerId, houseId, payFee, tradeCode, refundResons, selectedReason } = this.data;
    const res = await endpoint('refund', {
      customerId,
      houseId,
      payPlatform: 1,
      refundFee: payFee,
      tradeCode,
      refundReason: refundResons[selectedReason],
    });
    if (res.success) {
      wx.showToast({
        title: '退款成功',
        icon: 'success',
        duration: 2000,
      });
      this.setData({ hasPay: false });
    } else {
      wx.showToast({
        title: '退款失败',
        duration: 2000,
      });
    }
    this.setData({ showRefund: false });
  },

  cancelRefund() {
    this.setData({ showRefund: false });
  },

  async onPay() {
    const { openid, customerId, houseId, appId, secret, fee } = this.data;
    console.log('openid', openid, customerId, houseId, appId, secret, fee);
    const res = await endpoint('buyCard', {
      customerId,
      fee,
      houseId,
      orderSubject: "无锡WIII公寓户型定制入场券",
      payPlatform: 1,
      paySource: 1,
      uniqueCode: openid,
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
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: () => {
            if (!hasPay && !shareCustomId) {
              that.onSharePay();
            }
            that.setData({ doShare: false });
            wx.showToast({
              title: '保存成功',
            });
          },
          fail: (e) => {
            console.log(e);
          }
        });
      },
    });
  },

  async menuShare() {
    // 获取支付页面的海报
    const { nickname, headImage, houseId, customerId } = this.data;
    const res = await endpoint('poster', {
        head: headImage,
        houseId,
        name: nickname,
        path: 'pages/customPay/customPay',
        scene: `shareId=${customerId}`,
        width: 185,
        type: 2,
        xcxName: "无锡WIII",
    });
    // const timelineSrc = `${cdn}/space_type.png`;
    this.setData({ doShare: true, timelineSrc: res.single });
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

  async onShare(e) {
    const id = e.currentTarget.dataset.id;
    // 获取定制方案详情的海报
    const { nickname, headImage, houseId } = this.data;
    const res = await endpoint('poster', {
        head: headImage,
        houseId,
        name: nickname,
        path: 'pages/customDetail/customDetail',
        scene: `customId=${id}`,
        width: 185,
        type: 1,
        xcxName: "无锡WIII",
    });
    this.setData({ shareCustomId: id, doShare: true, timelineSrc: res.single });
  },

  closePopup() {
    this.setData({ showProgress: false });
  },

  closeCustomPopup() {
    this.setData({ showCustomPop: false });
  },

  onRouteCustom() {
    wx.navigateTo({ url: '/pages/customHouse/customHouse?fromCenter=1' });
  },

  onRouteDetail(e) {
    const url = `/pages/customDetail/customDetail?customId=${e.currentTarget.dataset.id}`;
    wx.navigateTo({ url });
  },

  async onLike(e) {
    const id = e.currentTarget.dataset.id;
    const { customerId, houseId, customerProgrammeId, customList: list } = this.data;
    const res = await endpoint('like', {
      houseId,
      customerId,
      customerProgrammeId: id,
    });
    const item = list.find(item =>  item.id === parseInt(id));
    item.like = item.isLike ? item.like - 1 : item.like + 1;
    item.isLike = !item.isLike;
    this.setData({ customList: list });
    e.stopPropagation && e.stopPropagation();
  },

  async onLikeStar(e) {
    const id = e.currentTarget.dataset.id;
    const { customerId, houseId, customerProgrammeId, rankList: list } = this.data;
    const res = await endpoint('like', {
      houseId,
      customerId,
      customerProgrammeId: id,
    });
    if (!res.success) {
      return;
    }
    const item = list.find(item =>  item.id === parseInt(id));
    item.like = item.isLike ? item.like - 1 : item.like + 1;
    item.isLike = !item.isLike;
    this.setData({ rankList: list });
    e.stopPropagation && e.stopPropagation();
  },

  touchstart (e) {
   //开始触摸时 重置所有删除
   const { customList } = this.data;
   customList.forEach(function (v, i) {
    if (v.isTouchMove)//只操作为true的
     v.isTouchMove = false;
   });
   this.setData({
    startX: e.changedTouches[0].clientX,
    startY: e.changedTouches[0].clientY,
    customList,
   })
  },

  touchmove(e) {
    var that = this,
    index = e.currentTarget.dataset.index,//当前索引
    startX = that.data.startX,//开始X坐标
    startY = that.data.startY,//开始Y坐标
    touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
    touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
    //获取滑动角度
    angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    const { customList } = this.data;
    customList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
       if (touchMoveX > startX) //右滑
        v.isTouchMove = false
       else //左滑
        v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      customList,
    })
  },

  angle(start, end) {
    var _X = end.X - start.X,
     _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
   },

  onDelete(e) {
    const { houseId, customList } = this.data;
    const id = e.currentTarget.dataset.id;
    const res = endpoint('delCustom', {
      houseId,
      id,
      status: -1,
    });
    const list = customList.filter(item => item.id !== parseInt(id));
    this.setData({ customList: list });
  },

  onClose() {
    this.setData({ doShare: false });
  },

  showActivityPop() {
    this.setData({ showPopup: !this.data.showPopup });
  },

  onRouteStar() {
    wx.navigateTo({ url: '/pages/customStars/customStars' });
  },
});
