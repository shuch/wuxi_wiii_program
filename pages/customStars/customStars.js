import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { houseTypesMapper, spaceTypeMapper, customDetailMapper, rankMapper } from '../../utils/convertor';
import { login } from '../../lib/promise';

const cdn = 'http://oh1n1nfk0.bkt.clouddn.com';

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
    wx.navigateTo({ url });
  },
});
