import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { houseTypesMapper, spaceTypeMapper } from '../../utils/convertor';

const cdn = 'http://7xot92.com1.z0.glb.clouddn.com';

// const spaceSubTypes = [
//   { id: 1, spaceType: 1, name: '景观小餐厅', thumb: cdn + 'space_type.png' },
//   { id: 2, spaceType: 1, name: '阳光下午茶', thumb: cdn + 'space_type2.png' },
//   { id: 3, spaceType: 1, name: '萌宠小花园', thumb: cdn + 'space_type3.png' },
// ];

// const spaceSubTypes2 = [
//   { id: 1, spaceType: 1, name: '迷你图书馆', thumb: cdn + 'space_type.png' },
//   { id: 2, spaceType: 1, name: '迷你办公区', thumb: cdn + 'space_type2.png' },
//   { id: 3, spaceType: 1, name: '迷你茶餐厅', thumb: cdn + 'space_type3.png' },
// ];

// const spaceSubTypes3 = [
//   { id: 1, spaceType: 1, name: '私人卧榻', thumb: cdn + 'space_type.png' },
//   { id: 2, spaceType: 1, name: '豪华卧榻', thumb: cdn + 'space_type2.png' },
//   { id: 3, spaceType: 1, name: '迷你卧榻', thumb: cdn + 'space_type3.png' },
// ];

// const spaceTypes = [
//   { id: 1, houseType: 1, name: '临窗小空间', subTypes: spaceSubTypes },
//   { id: 2, houseType: 1, name: '客厅+餐厅', subTypes: spaceSubTypes2 },
//   { id: 3, houseType: 1, name: '卧室', subTypes: spaceSubTypes3 },
// ];

// 总定制
// 0-未定制 未支付
// 1-已定制 未支付
// 2-已定制 已支付
// 3-未定制 已支付（直接购买入场券）
const customState = 1;

// 定制步骤
// 1-选择户型
// 2-户型编辑
//  21-引导1
//  22-引导2
//  23-引导3
const customStep = 1;

const CUSTOM_POP_UP = 'CUSTOM_POP_UP';

Page({
  data: {
    title: 'customHouse',
    // spaceTypes: spaceTypes,
    selectedType: null,
    // customState: customState,
    customStep: customStep,
    popup: false,
    guide: false,
    houseTypeUpdate: false,
    spaceEdit: false,
    commentMode: false,
    commentList: [],
    inputComment: '',
    coverTip: 1,
    cdn,
  },

  async onLoad(parmas) {
    console.log(parmas);
    // this.init();
    const houseId = 83;
    const customerId = 1;

    const res = await endpoint('customList', houseId);
    this.setData({
      houseId,
      customerId,
      houseTypes: res.list.map(houseTypesMapper),
    });
  },

  showGuide() {
    const popup = wx.getStorageSync(CUSTOM_POP_UP);
    // const { customState } = this.data;
    // const noCustom = customState === 0 || customState === 3;
    return !popup;
  },

  async onShow() {
    const houseId = 83;
    const customerId = 1;
    const res = await endpoint('customState', { customerId, houseId });
    // console.log('status', res.single.customizedStatus);
    res.single.customizedStatus = 1;
    if (this.showGuide() || !res.single.customizedStatus) {
      this.setData({ popup: true, guide: true });
    }
  },

  onSelect(e) {
    if (!e) return;
    const event = e.detail && e.detail.currentTarget ? e.detail : e;
    const { currentTarget: { dataset: { type } } } = event;
    const houseType = this.data.houseTypes.find(item => item.id === type);
    this.setData({ selectedType: houseType });
  },

  onHouseTypeUpdate() {
    this.setData({ houseTypeUpdate: true });
  },

  async onStep() {
    if (!this.data.selectedType) return;
    const res = await endpoint('customDetail', this.data.selectedType.id);
    console.log('res', res);
    this.setData({ customStep: 2, customDetial: res.single });
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

  onHouseTypeDidUpdate(e) {
    const { detail: { update } } = e;
    if (update) {
      // req save houseType
      console.log('req save houseType');
    }
    this.setData({ houseTypeUpdate: false });
  },

  async editSpace() {
    const res = await endpoint('spaceList', this.data.houseId);
    console.log('res', res);
    const spaceTypes = res.list.map(spaceTypeMapper);
    const selectedSpace = {
      type: spaceTypes[0],
      subType: spaceTypes[0].subTypes[0],
      name1: spaceTypes[0].subTypes[0].name,
      name2: spaceTypes[1].subTypes[0].name,
    };
    this.setData({
      spaceEdit: true,
      spaceTypes,
      selectedSpace,
    });
  },

  onSelectSpaceChange(e) {
    const event = e.detail && e.detail.currentTarget ? e.detail : e;
    const { currentTarget: { dataset: { type } } } = event;
    const spaceType = this.data.spaceTypes.find((item) => item.id === type);
    console.log('onSelectSpaceChange', spaceType);
    this.setData({ selectedSpace: { ...this.data.selectedSpace, type: spaceType }});
  },

  onSelectSubSpaceChange(e) {
    const event = e.detail && e.detail.currentTarget ? e.detail : e;
    const { currentTarget: { dataset: { type } } } = event;
    const subSpaceType = this.data.selectedSpace.type.subTypes.find((item) => item.id === type);
    const { spaceTypes, selectedSpace } = this.data;
    let name1, name2, name3;
    if (selectedSpace.type.id === 1) {
      name1 = subSpaceType.name;
      name2 = selectedSpace.name2;
      name3 = selectedSpace.name3;
    }
    if (selectedSpace.type.id === 2) {
      name1 = selectedSpace.name1;
      name2 = subSpaceType.name;
      name3 = selectedSpace.name3;
    }
    // console.log('groupName', groupName);
    this.setData({
      selectedSpace: {
        ...selectedSpace,
        subType: subSpaceType,
        name1,
        name2,
      }
    });
  },

  onSpaceDidUpdate(e) {
    const { detail: { update } } = e;
    if (update) {
      // req save houseType
      console.log('req save space', this.data.selectedSpace);
    }
    this.setData({ spaceEdit: false });
  },

  onComment() {
    console.log('onComment', this.data.commentMode);
    this.setData({ commentMode: !this.data.commentMode });
  },

  sendComment() {
    let { inputComment } = this.data;
    inputComment = inputComment.trim();
    if (inputComment.length) {
      const { commentList } = this.data;
      commentList.unshift(inputComment);
      this.setData({ commentList, inputComment: '' })
    }
  },

  bindKeyInput(e) {
    let { detail: { value } } = e;
    if (!value.length) {
      return;
    }
    value = value.trim();
    this.setData({ inputComment: value })
  },

  delComment(e) {
    if (!e) return;
    const { currentTarget: { dataset: { index } } } = e;
    const { commentList: newList } = this.data;
    newList.splice(index, 1);
    this.setData({ commentList: newList });
  }
});
