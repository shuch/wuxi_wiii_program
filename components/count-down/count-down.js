import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';

const TIME_INTERVAL = 1 * 1000;

Component({
  properties: {
    houseId: {
      type: Number,
      value: 83,
    },
    class: {
      type: String,
      value: '',
    },
  },

  data: {
    day: 30,
    hour: 12,
    min: 59,
  },

  methods: {
    updateTime() {
      const { endtime } = this.data;
      // const endtime = 1539619199000;
      const nowtime = Date.now();
      const lefttime = parseInt((endtime - nowtime) / 1000);
      let d;
      let h;
      let m;
      let s;

      if (lefttime <= 0) {
        d = 0;
        h = 0;
        m = 0;
        s = 0;
      } else {
        d = Math.floor(lefttime / (60 * 60 * 24))
        h = Math.floor(lefttime / (60 * 60) % 24);
        m = Math.floor(lefttime / 60 % 60);
        s = parseInt(lefttime % 60);
      }


      // h = this.addZero(h);
      m = this.addZero(m);
      this.setData({
        day: d,
        hour: h,
        min: m,
        sec: s,
        endtime,
      });
    },

    addZero(t) {
      return t < 10 ? `0${t}` : t;
    },

    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    }
  },
  async attached() {
    const { houseId } = this.properties;
    console.log('houseId', houseId);
    if (!houseId) {
      return;
    }
    const time = await endpoint('restTime', houseId);
    const { endTime: endtime } = time.single;
    this.setData({ endtime });
    this.updateTime();
    if (this.timer) {
      this.clearTimer();
    }
    this.timer = setInterval(() => {
      this.updateTime();
    }, TIME_INTERVAL);
  },
  detached() {
    this.clearTimer();
  },
  externalClasses: ['grey'],
})
