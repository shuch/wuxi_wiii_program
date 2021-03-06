import { trackRequest } from '../../utils/util';

Component({
  properties: {
    showActionSheet: {
      type: Boolean,
      value: true,
    },
    contentSrc: {
      type: String,
      value: '',
    },
    hasClose: {
      type: Boolean,
      value: true,
    },
    hasInnerBtn: {
      type: Boolean,
      value: false,
    },
    timelineSrc: {
      type: String,
      value: '',
    },
    openSetting: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    showMenu: true,
    timeline: false,
  },
  methods: {
    attached() {
      
    },
    onClose() {
      this.triggerEvent('onclose');
    },
    onShareFriend() {
      trackRequest({
        type: 'CLK',
        clkName: 'fenxainggeihaoyou',
        clkId: 'clk_2cdinzhi_16',
      });
      console.log('onsharefriend');
      this.triggerEvent('onsharefriend');
    },
    onShareTimeline() {
      trackRequest({
        type: 'CLK',
        clkName: 'fenxiangdaopengyouquan',
        clkId: 'clk_2cdinzhi_17',
      });
      this.setData({ timeline: true, showMenu: false });
      this.triggerEvent('menushare');
    },
    saveImage() {
      this.triggerEvent('onsaveimage');
    },
    onMenuTap() {
      console.log('onMenuTap');
    },
    handleSetting(e) {
      console.log('actionsheet' , e);
      this.triggerEvent('opensetting', e);
    },
  },
});

