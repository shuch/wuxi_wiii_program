import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { houseTypesMapper, spaceTypeMapper, customDetailMapper, rankMapper } from '../../utils/convertor';
import { login, getImageInfo } from '../../lib/promise';

const cdn = 'http://oh1n1nfk0.bkt.clouddn.com';

Page({
  data: {
    title: 'customDetail',
    commentExpand: false,
    cdn,
    tabSelected: 0,
    doShare: false,
    canvasHeight: 450,
    canvasWidth: 375,
  },

  async onLoad(parmas) {
    console.log(parmas);
    let customId;
    const { scene } = parmas;
    if (scene) {
      customId = scene.customId;
    } else {
      customId = parmas.customId;
    }
    const appData = await login();
    const { id: customerId, houseId, nickname, headPortrait: headImage } = appData;
    const res = await endpoint('customizedDetail', customId,customerId);
    const customDetail = customDetailMapper(res.single);
    if(customDetail.origin.nickname!=nickname){
        wx.setNavigationBarTitle({
            title: customDetail.origin.nickname+'的方案'
        });
    }
    this.loadImage(customDetail);

    const rankRes = await endpoint('rankList', {
      houseId,
      pageNo: 1,
      pageSize: 10,
      customerId,
    });
    const isSelf = customerId === customDetail.customerId;
    let rankList = rankRes.pageModel ? rankRes.pageModel.resultSet : [];
    rankList = rankList.map(rankMapper);
    this.setData({
      houseId,
      customerId,
      customId,
      customDetail,
      rankList,
      isSelf,
      nickname,
      headImage,
    });
  },

  switchTab(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ tabSelected: parseInt(id) });
  },

  onEdit() {
    const { customId: id } = this.data;
    wx.navigateTo({ url: `/pages/customHouse/customHouse?update=1&id=${id}` });
  },

  onSaveImage() {
    const that = this;
    const { timelineSrc } = this.data;
    wx.downloadFile({
      url: timelineSrc,
      success: function (res) {
        const path = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: () => {
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

  onShareAppMessage() {
    const { customerId, customId } = this.data;
    const path = `/pages/customDetail/customDetail?shareId=${customerId}&customId=${customId}`;
    return {
      title: '户型方案',
      path,
      success: () => {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        });
        this.setData({ doShare: false });
      },
    };
  },

  async menuShare() {
    const { nickname, headImage, houseId, customerId, customId } = this.data;
    const res = await endpoint('poster', {
        head: headImage,
        houseId,
        name: nickname,
        path: 'pages/customDetail/customDetail',
        scene: `customId=${customId}`,
        width: 185,
        type: 1,
        xcxName: "无锡WIII",
    });

    this.setData({ doShare: true, timelineSrc: res.single });
  },

  async onSave() {
    const { houseId, customerId, customId } = this.data;
    const res = await endpoint('copy', { houseId, originId: customId, customerId });
    if (res.success) {
      wx.showToast({
        title: '存入成功',
        icon: 'success',
        duration: 2000,
      });
    }
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

  async onLikeStar(e) {
    const id = e.currentTarget.dataset.id;
    console.log('id', id);
    const { customerId, houseId, rankList: list, customDetail,customId } = this.data;
    const res = await endpoint('like', {
      houseId,
      customerId,
      customerProgrammeId: id,
    });
    if (!res.success) {
      return;
    }
    // console.log(typeof customId, typeof id);
    if (id === customId) {
      customDetail.isThumbsUp = !customDetail.isThumbsUp;
      this.setData({ customDetail });
      return;
    }
    const item = list.find(item =>  item.id === parseInt(id));
    item.like = item.isLike ? item.like - 1 : item.like + 1;
    item.isLike = !item.isLike;
    this.setData({ rankList: list });
    e.stopPropagation && e.stopPropagation();
  },

  onClose() {
    this.setData({ doShare: false });
  },

  async loadImage(customDetail) {
    const { canvasHeight, canvasWidth } = this.data;
    const { commentImageUrl } = customDetail; 
    const res = await getImageInfo(commentImageUrl);
    const { height, width, path } = res;
    let initRatio = height / canvasHeight;
    if (initRatio < width / canvasHeight) {
      initRatio = width / canvasWidth;
    }
    //图片显示大小
    const scaleWidth = (width / initRatio)
    const scaleHeight = (height / initRatio)

    this.startX = canvasWidth / 2 - scaleWidth / 2;
    this.startY = canvasHeight / 2 - scaleHeight / 2;
    this.setData({
      imgWidth: scaleWidth,
      imgHeight: scaleHeight,
      imgTop: this.startY,
      imgLeft: this.startX,
      customImageUrl: commentImageUrl,
    });
    this.scaleWidth = scaleWidth;
    this.scaleHeight = scaleHeight;
    console.log('loadImage', initRatio, this.startX, this.startY, scaleWidth, scaleHeight);

  },

  onRouteStar() {
    wx.navigateTo({ url: '/pages/customStars/customStars' });
  },
});
