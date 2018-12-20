import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { login } from '../../lib/promise';

const cdn = 'http://pjrpw22gp.bkt.clouddn.com';

Page({
  data: {
    cdn,
    all: true,
    first: false,
    second: false,
    third: false,
    list: [],
  },

  async onLoad() {
    const data = await login();
    const { houseId } = data;
    const res = await endpoint('vipFloors', houseId);
    console.log(res);
    this.setData({ list: res.list });
  },

  light(e) {
    const target = e.currentTarget.dataset.area;
    console.log('target', target);
    if (target === '1') {
      this.setData({ first: true, second: false, third: false });
    }
    if (target === '2') {
      this.setData({ first: false, second: true, third: false });
    }
    if (target === '3') {
      this.setData({ first: false, second: false, third: true });
    }

    this.setData({ all: false });
  },

  onRouteCustom(e) {
    const url = `/pages/customHouse/customHouse?floorId=${e.target.dataset.id}`;
    wx.navigateTo({ url });
  }
})