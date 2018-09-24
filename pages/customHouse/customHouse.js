const houseTypes = [
  { id: 1, area: 30, name: 'A', height: 3.6 },
  { id: 2, area: 45, name: 'B', height: 2.4 },
  { id: 3, area: 60, name: 'C', height: 5.2 },
];

// 总定制
// 0-未定制 未支付
// 1-已定制 未支付
// 2-已定制 已支付
// 3-未定制 已支付（直接购买入场券）
const customState = 0;

// 定制步骤
// 1-选择户型
// 2-户型编辑
//  21-引导1
//  22-引导2
//  23-引导3
const customStep = 2;

const CUSTOM_POP_UP = 'CUSTOM_POP_UP';

Page({
  data: {
    title: 'customHouse',
    houseTypes: houseTypes,
    selectedType: null,
    customState: customState,
    customStep: customStep,
    popup: false,
    coverTip: 1,
  },

  onLoad(parmas) {
    console.log(parmas);
  },

  onShow() {
    const popup = wx.getStorageSync(CUSTOM_POP_UP);
    const { customState } = this.data;
    const noCustom = customState === 0 || customState === 3;
    if (!popup || noCustom) {
      this.setData({ popup: true });
    }
  },

  onSelect(e) {
    if (!e) return;
    const { currentTarget: { dataset: { item } } } = e;
    const houseType = this.data.houseTypes.find(type => type.id === item);
    this.setData({ selectedType: houseType });
  },

  onStep() {
    if (!this.data.selectedType) return;
    this.setData({ customStep: 2 });
  },

  onKnown() {
    wx.setStorageSync(CUSTOM_POP_UP, 1);
    this.setData({ popup: false });
    // req save customStep
  },

  onCoverTip(e) {
    if (!e) return;
    const { currentTarget: { dataset: { step } } } = e;
    const coverTip = step > 2 ? 0 : +step + 1;
    this.setData({ coverTip });
  },
});
