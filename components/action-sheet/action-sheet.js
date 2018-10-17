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

    },
    onShareTimeline() {
      this.setData({ timeline: true, showMenu: false });
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

