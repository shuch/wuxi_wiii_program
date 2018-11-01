import {trackRequest} from "../../utils/util";

Component({
  properties: {
    type: {
      type: String,
      value: 'huxing',
    },
    houseTypes: {
      type: Array,
      value: [],
    },
    houseTypeSelected: {
      type: Object,
      value: {},
    },
    spaceTypes: {
      type: Array,
      value: [],
    },
    spaceSelected: {
      type: Object,
      value: {},
    },
    spaceNames: {
      type: Object,
      value: {},
    },
  },
  methods: {
    attached() {
      
    },
    onSelectChange(e) {
      this.triggerEvent('onselectchange', e);
    },
    onPickCancel() {
      var data={};
      if (this.properties.type === 'huxing') {
        this.triggerEvent('oncancel', { update: false });
        data={
            type: 'CLK',
            clkName: 'quxiaoxaunzehuxing',
            clkId: 'clk_2cdinzhi_8',
        }
      }
      if (this.properties.type === 'space') {
        this.triggerEvent('onspacecancel', { update: false });
          data={
              type: 'CLK',
              clkName: 'quxiaoxuanzekongjian',
              clkId: 'clk_2cdinzhi_12',
          }
      }
        trackRequest(data);
    },
    onPickSure() {
      if (this.properties.type === 'huxing') {
        this.triggerEvent('onsure', { update: true });
      }
      if (this.properties.type === 'space') {
        this.triggerEvent('onspacesure', { update: true });
      }
    },
    onSelectSpaceChange(e) {
      this.triggerEvent('onselectspacechange', e);
    },
    onSelectSubSpaceChange(e) {
      this.triggerEvent('onselectsubspacechange', e);
    },

    onClose() {
      this.triggerEvent('onclose');
    },

    onMenuTap() {},
  },
});

