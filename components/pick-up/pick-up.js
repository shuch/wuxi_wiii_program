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
      if (this.properties.type === 'huxing') {
        this.triggerEvent('oncancel', { update: false });
      }
      if (this.properties.type === 'space') {
        this.triggerEvent('onspacecancel', { update: false });
      }
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
  },
});

