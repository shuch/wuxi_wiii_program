import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { houseTypesMapper, spaceTypeMapper, customDetailMapper, rankMapper } from '../../utils/convertor';
import { login } from '../../lib/promise';
import { trackRequest } from '../../utils/util';

const cdn = 'https://dm.static.elab-plus.com/wuXiW3/img';

Page({
  data: {
    cdn,
    pageNo: 1,
    pageSize: 10,
    rankList:[],
    total:1,
    customizedStatus: 0,
  },

  async onLoad(parmas) {
    console.log(parmas);
    const appData = await login();
    const { id: customerId, houseId } = appData;
    this.setData({
      houseId,
      customerId,
    });
    this.getData();
    this.customState();
  },
  onShow() {
    const param = {
      type: 'PV',
      pvId: 'P_2cdinzhi_5',
      pvCurPageName: 'fanganpaihangbang',
    };
    trackRequest(param);
  },
  async customState() {
    const { customerId, houseId } = this.data;
    const state = await endpoint('customState', { customerId, houseId });
    const {
      single: {
        customizedStatus,
      },
    } = state;
    this.setData({ customizedStatus });
  },
  onReachBottom(){
    this.getData()
  },
  async getData(){
    if(this.data.total<this.data.pageNo){
      return false
    }
    const { houseId, customerId } = this.data;
    const rankRes = await endpoint('rankList', {
        houseId,
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize,
        customerId,
    });
    let rankList = rankRes.pageModel ? rankRes.pageModel.resultSet : [];
    rankList = rankList.map(rankMapper);
    this.setData({
        total:rankRes.pageModel.total,
        rankList:this.data.rankList.concat(rankList),
        pageNo: this.data.pageNo+1,
        pageSize: this.data.pageSize,
    });
  },
  onRouteCustom() {
    wx.navigateTo({ url: '/pages/customHouse/customHouse' });
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

  onRouteDetail(e) {
    const url = `/pages/customDetail/customDetail?customId=${e.currentTarget.dataset.id}`;
    this.navigateCustom(url);
    // wx.navigateTo({ url });
    trackRequest({
      type: 'CLK',
      clkName: 'huxingfangan',
      clkId: 'clk_2cdinzhi_30',
    });
  },

  navigateCustom(url) {
    const pages = getCurrentPages();
    console.log('pages', pages);
    if (pages && pages.length > 4) {
      wx.redirectTo({ url });
    } else {
      wx.navigateTo({ url });
    }
  },
});
