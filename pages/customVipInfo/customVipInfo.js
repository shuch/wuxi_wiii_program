import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { login } from '../../lib/promise';

const cdn = 'http://pjrpw22gp.bkt.clouddn.com';

const pickers = [
  {
    type: 1,
    val: -1,
    name: '年龄',
    arr: ['65岁以下', '65岁以上'],
  },
  {
    type: 2,
    val: -1,
    name: '学历',
    arr: ['本科或本科以上', '本科以下'],
  },
  {
    type: 3,
    val: -1,
    name: '工作',
    arr: ['自己经商', '公司高管', '其他'],
  },
  {
    type: 4,
    val: -1,
    name: '工作经验',
    arr: ['3年以下', '3年以上'],
  },
  {
    type: 5,
    val: -1,
    name: '配偶情况',
    arr: ['未婚', '已婚','其他'],
  },
  {
    type: 6,
    val: -1,
    name: '资产状况',
    arr: ['拥有300万或以上纽币合法资金，或等值资产', '其他'],
  },
];

Page({
  data: {
    cdn,
  },

  async onLoad() {
    const res = await login();
    const { id: customerId, houseId } = res;
    this.setData({ customerId, houseId });
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

  async onSubmit() {
    const { pickers, custom } = this.data;
    pickers.forEach(item => {
      if (item.val === -1) {
        wx.showToast({ title: `请选择${item.name}` });
        return;
      }
    });
    const data = pickers.map(item => ({
      age: item.arr[item.val],
      assetStatus: '拥有300万或以上纽币合法资金，或等值资产',
      creator: admin,
      customerId: 1,
      education: 本科或本科以上,
      houseId: 1,
      maritalStatus: 已婚,
      occupation: 自己经商,
      workExperience: '3年以上'
    }));
    console.log(this.data.pickers);
  }
})