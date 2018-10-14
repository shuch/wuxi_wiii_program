import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { login } from '../../lib/promise'

const cdn = 'http://oh1n1nfk0.bkt.clouddn.com';

Page({
  data: {
    cdn,
    name: '',
    region: [],
    sex: '',
    sexArray: [],
    age: 0,
    canSave: false,
    hasPay: false,
  },

  generateRangeArray(start, end) {
  	const array = [];
  	for (let i = start; i <= end; i += 1) {
  		array.push(i);
  	}
  	return array;
  },

  generateRange() {
    const array = ['00','95','90','85','80','70','60','50'];
    return array.map(item => `${item}后`);
  },

  async onLoad(parmas) {
    const appData = await login();
    const { id: customerId, houseId } = appData;
    const ageArray = this.generateRangeArray(1940, 2018);
    // const ageArray = this.generateRange();
    const sexArray = [{value: 1, text: '先生'}, {value:0, text: '女士'}];
    const state = await endpoint('customState', { customerId, houseId });
    const { single: { paymentStatus, customerSupplementStatus } } = state;
    const hasPay = paymentStatus === 2;
    this.setData({
      ageArray,
      sexArray,
      customerId,
      houseId,
      hasPay,
    });
    if (customerSupplementStatus === 1) {
      if (hasPay) {
        wx.navigateTo({ url: '/pages/customCenter/customCenter' });
      } else {
        wx.navigateTo({ url: '/pages/customPay/customPay' });
      }
      return;
    }
  },

  async onShow() {
  },

  bindKeyInput(e) {
    this.setData({ name: e.detail.value });
  },

  bindBlur(e) {
    const { name } = this.data;
    if (name.trim().length > 5) {
      wx.showToast({ title: '昵称不超过5个字噢', icon: 'none' });
      return;
    }
  },

  changeAge(e) {
  	const index = e.detail.value;
  	const value = this.data.ageArray[index];
  	this.setData({ ageIndex: index, age: value });
  },

  bindRegionChange(e) {
  	const value = e.detail.value;
  	this.setData({ region: value });
  	console.log('bindPickerChange', value);
  },

  changeSex(e) {
  	if (!e) return;
  	const { currentTarget: { dataset: { value } } } = e;
  	const { sexArray: nSex } = this.data;
  	nSex.forEach((item) => {
  		item.selected = item.value === value;
  	});
  	this.setData({ sexArray: nSex, sex: value });
  },

  async onSave() {
    const { name, sex, age, region, customerId, houseId, hasPay } = this.data;
    if (!name) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }
    if (sex === '') {
      wx.showToast({ title: '请选择性别', icon: 'none' });
      return;
    }
    if (!age) {
      wx.showToast({ title: '请选择年龄', icon: 'none' });
      return;
    }
    if (!region.length) {
      wx.showToast({ title: '请选择区域', icon: 'none' });
      return;
    }
    const res = await endpoint('saveCustomInfo', {
      age,
      city: region[1],
      province: region[0],
      customerId,
      gender: sex,
      houseId,
      nickName: name,
    });
    console.log(res);
    // 支付-定制流程
    if (hasPay) {
      wx.navigateTo({ url: '/pages/customCenter/customCenter' });
      return;
    }
    // 定制-支付流程
    if (res.success) {
      wx.navigateTo({ url: '/pages/customPay/customPay' });
    }
  },

  redirect() {

  }
});
