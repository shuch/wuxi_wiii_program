Component({
  properties: {
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
  },
  methods: {
    attached() {
      
    },
    onClose() {
      this.triggerEvent('onclose');
    }
  },
});

