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
  }
})