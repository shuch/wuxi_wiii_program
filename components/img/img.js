Component({
  properties: {
    src: {
      type: String,
      value: '',
    },
    cClass: {
      type: String,
      value: '',
    },
    cStyle: {
      type: String,
      value: '',
    },
    mode: {
      type: String,
      value: 'aspectFit',
    },
    param: {
      type: Object,
      value: '',
    },
    index: {
      type: Number,
      value: '',
    },

  },
  data: {
      loaded: false,
      error:false,
      loading:'../../image/wepy_pro/loading1.gif',
      errorImg:'../../image/wepy_pro/errorImg.png'
  },
  methods: {
      load(e){
          this.setData({
              'loaded':true
          })
          let width=e.detail.width,height=e.detail.height,index=this.data.index;
          this.triggerEvent('loaded', {width,height,index})
      },
      click(e){
          let param = e.currentTarget.dataset.param,index=this.data.index;
          this.triggerEvent('click', {param,index})
      },
      errorLoad(e){
          console.log(e);
          this.setData({
              'error':true
          })
      }
  },
});

