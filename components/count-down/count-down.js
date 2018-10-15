import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
var app = getApp()
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
      const nowtime = Date.now();
      const lefttime = parseInt((endtime - nowtime) / 1000);
      if (lefttime <= 0) {
        return;
      }
      let d = Math.floor(lefttime / (1000 * 60 * 60 * 24))
      let h = Math.floor(lefttime / (60 * 60) % 24);
      let m = Math.floor(lefttime / 60 % 60);
      let s = parseInt(lefttime % 60);

      h = this.addZero(h);
      m = this.addZero(m);
      this.setData({
        day: d,
        hour: h,
        min: m,
        sec: s,
        endtime,
      });
      app.globalData.endTime=`剩余${this.data.day}天${this.data.hour}时${this.data.min}分`
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
