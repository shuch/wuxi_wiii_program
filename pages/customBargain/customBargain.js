import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { login, getSetting, savePhoneAuth } from '../../lib/promise';
import { trackRequest } from '../../utils/util';

const cdn = 'https://dm.static.elab-plus.com/wuXiW3/img';

const app = getApp();

const defaultAvatar = 'https://dm.static.elab-plus.com/wuXiW3/price/default_avatar.png';

Page({
  data: {
    doShare: false,
    cdn,
    fee: 600,
    shareToken: '',
    timelineSrc: '',
    fromShare: false,
    openSetting: false,

    sussPopup: false,
    overPopup: false,

    openid: '',
    shareId: '',
    customerId: 0,
    houseId: 0,
    appId: '',
    secret: '',
    nickname: '',
    headImage: '',

    isMine: false,
    isBargain: false,
    isHaveHigh: false,
    highName: '',
    highValue: 0,
    bargainValue: 0,
    list: [],
    total: 0,
    defaultAvatar,

    isMoreOpen: false,
    isShowMoreBtn: false,

    bargainSussValue: 0,
  },

  track(type) {
    const {
      isMine
    } = this.data;
    const {
      globalData: {
        shareToken,
      },
    } = app;
    const params = {
      type: 'CLK',
      clkName: '',
      clkId: '',
    };
    switch (type) {
      case 0: {
        // pv
        if (isMine) {
          // 自己砍价 PV
          trackRequest({
            type: 'PV',
            pvId: 'p_2cmina_19',
            pvCurPageName: 'kanjiayemian',
            pvCurPageParams: shareToken ? { shareToken } : "{}",
          });
        } else {
          trackRequest({
            type: 'PV',
            pvId: 'p_2cmina_20',
            pvCurPageName: 'bangmangkanjiayemian',
            pvCurPageParams: shareToken ? { shareToken } : "{}",
          });
        }
      }
      case 1: // 砍价分享
        params.clkName = 'kanjiafenxiang';
        params.clkId = 'clk_2cmina_67';
        trackRequest(params);
      case 2: // 自己砍
        params.clkName = 'zijikananniu';
        params.clkId = 'clk_2cmina_68';
        trackRequest(params);
      case 3: // 帮TA砍
        params.clkName = 'bangtakanjiaanniu';
        params.clkId = 'clk_2cmina_69';
        trackRequest(params);
      case 4: // 分享好友
        params.clkName = 'fenxiangweixinhaoyou';
        params.clkId = 'clk_2cmina_70';
        trackRequest(params);
      case 5: // 分享朋友圈
        params.clkName = 'fenxiangdaoweixinpengyouquan';
        params.clkId = 'clk_2cmina_71';
        trackRequest(params);
      default:
    }
  },

  async onLoad(parmas) {
    // console.log({ path: this.route, parmas } );
    let { scene, shareId = '' } = parmas;

    if (scene) {
      shareId = decodeURIComponent(scene).split('=')[1];
    }
    // console.log('app.globalData:', app.globalData);
    app.globalData.shareToken = shareId;

    const loginData = await login();

    const {
      houseId,
      id: customerId,
      openId: openid,
    } = loginData;
    const {
      globalData: {
        appid: appId,
        secret,
      },
    } = app;
    // console.log('app.globalData:', app.globalData);
    
    // test data
    // const customerId = 2808
    const fromShare = !!shareId && parseInt(shareId) !== customerId;

    // console.log('shareId:', shareId);
    // console.log('customerId:', customerId);
    // console.log('fromShare:', fromShare);
    // console.log('loginData:', loginData);

    this.setData({
      openid,
      shareId,
      houseId,
      appId,
      secret,
      customerId,
      fromShare,
      isMine: shareId ? String(customerId) === String(shareId) : true,
    });
    await this.initData();
    this.track(0);
  },

  async initData() {
    const { customerId, shareId, houseId } = this.data;
    const bargainStatus = await endpoint('bargainStatus', { customerId: shareId || customerId, houseId });

    // console.log(bargainStatus);

    const {
      single: {
        recordList,
        highestRecord,
        inviterInfo: {
          bargainCustomerName: nickname,
          headPic: headImage,
        }
      },
    } = bargainStatus;
    const list = recordList || [];
    // const list = [
    //   { "id": 57, "houseId": 83, "customerId": 2805, "bargainCustomerId": 2891, "bargainCustomerName": null, "headPic": null, "bargainValue": 89, "created": 1544609377000 },
    //   { "id": 57, "houseId": 83, "customerId": 2805, "bargainCustomerId": 2891, "bargainCustomerName": null, "headPic": null, "bargainValue": 89, "created": 1544609377000 },
    //   { "id": 57, "houseId": 83, "customerId": 2805, "bargainCustomerId": 2891, "bargainCustomerName": null, "headPic": null, "bargainValue": 89, "created": 1544609377000 },
    //   { "id": 57, "houseId": 83, "customerId": 2805, "bargainCustomerId": 2891, "bargainCustomerName": null, "headPic": null, "bargainValue": 89, "created": 1544609377000 },
    //   { "id": 57, "houseId": 83, "customerId": 2805, "bargainCustomerId": 2891, "bargainCustomerName": null, "headPic": null, "bargainValue": 89, "created": 1544609377000 },
    // ];

    // console.log(list);
    const customDataArr = list.filter(item => item.bargainCustomerId === customerId);
    let isBargain = false;
    if (customDataArr && customDataArr.length > 0) {
      isBargain = true;
    }
    let total = 0;
    list.map(item => total += item.bargainValue);

    const bargainValueArr = list.filter(item => item.bargainCustomerId === customerId);
    let bargainValue = 0;
    if (bargainValueArr && bargainValueArr.length > 0) {
      bargainValue = bargainValueArr[0].bargainValue;
    }

    let isHaveHigh = false;
    let highName = '';
    let highValue = 0;
    // console.log('highestRecord:', highestRecord);
    if (highestRecord) {
      isHaveHigh = true;
      highName = highestRecord.bargainCustomerName;
      highValue = highestRecord.bargainValue;
    }

    let isShowMoreBtn = false;
    if (list && list.length > 6) {
      isShowMoreBtn = true;
    }
    this.setData({
      list: list.map((item) => {
        return {
          ...item,
          time: this.formatDate(item.created),
        };
      }),
      isBargain,
      total,
      bargainValue,
      isHaveHigh,
      highName,
      highValue,
      isShowMoreBtn,

      nickname,
      headImage: headImage || defaultAvatar,
      // fromEntry,
    });
  },

  formatDate(date) {
    const calc = new Date().getTime() - date;
    if (calc < 10 * 60 * 1000) {
      return '刚刚';
    } else if (calc < 60 * 60 * 1000) {
      return parseInt(calc / (60 * 1000), 10) + '分钟前';
    } else if (calc < 24 * 60 * 60 * 1000) {
      return parseInt(calc / (60 * 60 * 1000), 10) + '小时前';
    }
    const d = new Date(date);
    return '' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  },

  onclickmore() {
    this.setData({
      isShowMoreBtn: false,
      isMoreOpen: true,
    });
  },

  async onClickBargain() {
    const { customerId, shareId, houseId, isMine } = this.data;
    const bargain = await endpoint('bargainAction', { bargainCustomerId: customerId, customerId: shareId || customerId, houseId });
    if (bargain.success) {
      this.setData({
        sussPopup: true,
        bargainSussValue: bargain.single.bargainValue,
      });
    } else if (bargain.errorCode === 'ERROR.0005') {
      this.setData({
        overPopup: true,
      });
    } else {
      wx.showToast({ title: '砍价失败', icon: 'none' });
    }
    await this.initData();
    if (isMine) {
      this.track(2);
    } else {
      this.track(3);
    }
  },

  onCloseSussPopup() {
    this.setData({
      sussPopup: false,
    });
  },
  onCloseOverPopup() {
    this.setData({
      overPopup: false,
    });
  },

  // addShareRecord() {
  //   const { houseId, customerId, shareId } = this.data;
  //   endpoint('addShare', {
  //     houseId,
  //     masterCustomerId: shareId,
  //     guestCustomerId: customerId,
  //   });
  // },

  onShowPopup() {
    this.track(1);
    this.setData({ doShare: true });
  },

  onClose() {
    this.setData({ doShare: false });
  },

  async menuShare() {
    const { nickname, headImage, houseId, customerId } = this.data;
    const path = this.route;
    const scene = `shareId=${customerId}&from=customBargain`;
    const res = await endpoint('poster', {
      head: headImage,
      houseId,
      name: nickname,
      path,
      scene,
      width: 185,
      type: 3,
      xcxName: "无锡WIII",
    });
    this.setData({ doShare: true, timelineSrc: res.single });
    this.track(4);
  },

  onShareAppMessage() {
    const { customerId } = this.data;
    const imageUrl = 'https://dm.static.elab-plus.com/wuXiW3/price/share.jpg';
    return {
      title: '我要买房，房价你说了算！快来帮我砍价，最高10万元减免',
      imageUrl,
      path: `${this.route}?shareId=${customerId}&from=customBargain`,
      success: () => {
        console.log('success');
      },
    };
  },

  onShareFriend() {
    console.log('onShareFriend');
  },

  async onSaveImage() {
    this.track(5);
    const setting = await getSetting();
    if (setting['scope.writePhotosAlbum']) {
      this.savePhoto();
      return;
    }
    // wx.showToast({ title: '暂无权限，点击授权后可保存图片', icon: 'none' });
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
    } else {
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
          },
          fail: (e) => {
            console.log(e);
          }
        });
      },
    });
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
