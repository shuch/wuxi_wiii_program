const cdn = 'http://pjrpw22gp.bkt.clouddn.com';

const list = [
  { 
    id: 1,
    avatar: `${cdn}/i-design.png`,
    name: 'KaiLim',
    desc: '您的户型定制方案,开发商将据此为您量身打造',
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
    list,
  },
})