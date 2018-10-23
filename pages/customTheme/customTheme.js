
const cdn = 'http://oh1n1nfk0.bkt.clouddn.com';

const colorList = [
	{
		name: '蒂凡尼蓝',
		effect: cdn + '/theme.png',
	},
	{
		name: '胭脂魅力',
		effect: cdn + '/theme2.png',
	},
	{
		name: '纯净撞击',
		effect: cdn + '/theme.png',
	},
	{
		name: '原绿觉醒',
		effect: cdn + '/theme2.png',
	}
];

Page({
  data: {
    title: 'customTheme',
    cdn,
    colorList,
    selectTheme: 0,
  },

  onLoad(parmas) {
    console.log(parmas);
  },

  onSelect(e) {
  	console.log(e);
  	this.setData({ selectTheme: e.currentTarget.dataset.id });
  },

  onBack() {
  	wx.navigateBack();
  },
});
