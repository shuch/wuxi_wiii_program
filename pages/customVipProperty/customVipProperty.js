const cdn = 'http://pjrpw22gp.bkt.clouddn.com';

const list = [
  { 
    id: 1,
    icon: `${cdn}/buy.png`,
    text: '优先购房',
  },
  { 
    id: 2,
    icon: `${cdn}/immigrant.png`,
    text: '移民咨询',
  },
  { 
    id: 3,
    icon: `${cdn}/i-design.png`,
    text: '专属设计',
  },
  { 
    id: 4,
    icon: `${cdn}/i-discount.png`,
    text: '私享折扣',
  },
  { 
    id: 5,
    icon: `${cdn}/service.png`,
    text: '专线服务',
  }
];

Page({
  data: {
    cdn,
    list,
  },
})