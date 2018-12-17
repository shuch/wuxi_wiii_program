const cdn = 'http://pjrpw22gp.bkt.clouddn.com';

const list = [
  { 
    id: 1,
    hide: true,
  },
  { 
    id: 2,
    avatar: `${cdn}/i-discount.png`,
    name: 'KaiLim',
    desc: '您将享有专属的贵宾折扣礼遇',
  },
];

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