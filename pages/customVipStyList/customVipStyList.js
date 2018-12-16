const cdn = 'http://pjrpw22gp.bkt.clouddn.com';

const list = [
  { 
    id: 1,
    avatar: `${cdn}/designer.png`,
    name: 'KaiLim',
    desc: '有丰富的海外地产经验,注重生活美学,致力为客户创造极致的生活体验。',
  },
  { 
    id: 2,
    avatar: `${cdn}/designer.png`,
    name: 'KaiLim',
    desc: '有丰富的海外地产经验,注重生活美学,致力为客户创造极致的生活体验。',
  },
];

Page({
  data: {
    cdn,
    list,
  },
})