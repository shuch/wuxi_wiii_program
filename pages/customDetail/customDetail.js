import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { houseTypesMapper, spaceTypeMapper, customDetailMapper, rankMapper } from '../../utils/convertor';
import { login } from '../../lib/promise';

const cdn = 'http://oh1n1nfk0.bkt.clouddn.com';

Page({
  data: {
    title: 'customDetail',
    commentExpand: false,
    cdn,
    commentList: [
    	{ id: 1, content: '端口数量大幅'},
    	{ id: 2, content: '地方飓风'},
    ],
    tabSelected: 0,
    doShare: false,
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
    const { id: customerId, houseId } = appData;
    const res = await endpoint('customizedDetail', customId);
    const customDetail = customDetailMapper(res.single);
    console.log('customDetail', customDetail);
    const timelineSrc = `${cdn}/space_type.png`;
    const rankRes = await endpoint('rankList', {
      houseId,
      pageNo: 1,
      pageSize: 10,
      customerId,
    });
    const isSelf = customerId === customDetail.customerId;
    let rankList = rankRes.pageModel ? rankRes.pageModel.resultSet : [];
    rankList = rankList.map(rankMapper);
    this.setData({ houseId, customerId, customId, customDetail, rankList, timelineSrc, isSelf });
  },

  switchTab(e) {
    const id = e.currentTarget.dataset.id;
    console.log(id);
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

  menuShare() {
    this.setData({ doShare: true });
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
});
