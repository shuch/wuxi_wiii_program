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
    }
  },
});

