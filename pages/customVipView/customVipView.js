import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { login } from '../../lib/promise';

const cdn = 'http://pjrpw22gp.bkt.clouddn.com';

Page({
  data: {
    cdn,
    currentFloor: 1,
  },

  async onLoad(param) {
    const data = await login();
    const { houseId } = data;
    const { floorId = 1 } = param;
    const res = await endpoint('vipFloors', houseId);
    const currentFloor = res.list.find(item => String(item.id) === floorId);
    this.setData({ list: res.list, currentFloor });
  },

  onChange(e) {
    //event.detail = {current: current, source: source}
    const target = e.detail.current;
    console.log('target', target);
    const currentFloor = this.data.list[target];
    this.setData({ currentFloor });
  }
})