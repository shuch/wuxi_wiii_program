Component({
  properties: {
    label: {
      type: String,
      value: '',
    },
    value: {
      type: Number,
      value: 0,
    },
    range: {
      type: Array,
      value: [],
    },
    type: {
      type: Number,
      value: 1,
    }
  },
  data: {
    showMenu: true,
    timeline: false,
  },
  methods: {
    onPickChange(e) {
      // console.log(e);
      this.triggerEvent('change', e);
    },
  },
});
