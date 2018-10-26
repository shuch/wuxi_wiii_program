import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { themeMapper } from  '../../utils/convertor';

const cdn = 'https://dm.static.elab-plus.com/wuXiW3/img';

Page({
  data: {
    cdn,
    colorList: [],
    selectTheme: 0,
  },

  async onLoad(parmas) {
    console.log(parmas);
  	const { houseId, layoutId = 115 } = parmas;
  	const res = await endpoint('theme', parmas);
  	this.setData({ colorList: themeMapper(res.list) });
  },

  onSelect(e) {
  	console.log(e);
  	this.setData({ selectTheme: e.currentTarget.dataset.id });
  },

  onBack() {
  	wx.navigateBack();
  },
});
