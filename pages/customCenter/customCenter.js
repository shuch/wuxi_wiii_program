import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';

const cdn = 'http://oh1n1nfk0.bkt.clouddn.com';
// 总定制
// 0-未定制 未支付
// 1-已定制 未支付
// 2-已定制 已支付
// 3-未定制 已支付（直接购买入场券）
const customState = 2;

Page({
  data: {
    cdn,
    showIntro: false,
    showProgress: true,
  },

  async onLoad(parmas) {
    const hasPay = customState === 2 || customState === 3;
    const customList = [1,2,3];
    this.setData({ hasPay, customList });
  },

  showIntro() {
    this.setData({ showIntro: true });
  },

  hideIntro() {
    this.setData({ showIntro: false })
  }
});
