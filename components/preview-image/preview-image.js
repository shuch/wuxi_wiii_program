Component({
  properties: {
    src: {
      type: String,
      value: '',
    },
    class: {
      type: String,
      value: '',
    },
    mode: {
      type: String,
      value: '',
    },
  },
  methods: {
    attached() {
      
    },
    onPreview() {
      const src = this.properties.src;
      wx.previewImage({
        urls: [src],
        current: src,
      })
    }
  },
});

