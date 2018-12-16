const cdn = 'http://pjrpw22gp.bkt.clouddn.com';

const pickers = [
  {
    type: 1,
    val: -1,
    name: '年龄',
    arr: ['00','95','90','85','80','70','60','50'].map(item => `${item}后`),
  },
  {
    type: 2,
    val: -1,
    name: '学历',
    arr: ['大专', '本科','硕士','博士'],
  },
  {
    type: 3,
    val: -1,
    name: '工作',
    arr: ['互联网', '教育','医疗'],
  },
  {
    type: 4,
    val: -1,
    name: '工作经验',
    arr: ['1年', '2年','3年'],
  },
  {
    type: 5,
    val: -1,
    name: '配偶情况',
    arr: ['未婚', '已婚','离异'],
  },
  {
    type: 6,
    val: -1,
    name: '资产状况',
    arr: ['租房', '买房','公寓'],
  },
];

Page({
  data: {
    cdn,
  },

  generateAge() {
    const array = ['00','95','90','85','80','70','60','50'];
    return array.map(item => `${item}后`);
  },

  generateEdu() {
    const array = ['大专', '本科','硕士','博士'];
    return array;
  },

  onLoad() {
    this.setData({ pickers });
  },

  bindChange(e) {
    console.log('e', e);
    const { type } = e.detail.target.dataset;
    const { value } = e.detail.detail;
    const { pickers } = this.data;
    const picker = pickers.find(item => item.type === type);
    picker.val = parseInt(value, 0);
    this.setData({ pickers });
  },

  onSubmit() {
    console.log(this.data.pickers);
  }
})