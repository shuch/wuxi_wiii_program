import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { houseTypesMapper, spaceTypeMapper, customDetailMapper } from '../../utils/convertor';
import { login } from '../../lib/promise';

const cdn = 'http://oh1n1nfk0.bkt.clouddn.com';

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
    selectedType: null,
    spaceNames: {},
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
    commentExpand: true,
  },

  async onLoad(parmas) {
    console.log(parmas);
    const appData = await login();
    const { id: customerId, houseId } = appData;
    console.log('appData', customerId, houseId);
    // const customerId = 16507;
    // const houseId = 10000;
    // const isCreate = parmas.create;
    const { update, create, id } = parmas;
    const state = await endpoint('customState', { customerId, houseId });
    const {
      single: {
        customizedStatus,
        paymentStatus,
        customerProgrammeId,
      },
    } = state;

    // 有暂存方案或编辑方案
    const customizedId = customerProgrammeId || id;
    const unFinished = !customizedStatus && customerProgrammeId;
    const shouldUpdate = unFinished || update;
    const finishOne = customizedStatus || paymentStatus === 1;
    const redirectCenter = finishOne && !update && !create;
    // const redirectCenter = false;
    if (redirectCenter) {
      wx.redirectTo({ url: '/pages/customCenter/customCenter' });
      return;
    }

    const data = {
      houseId,
      customerId,
      customizedStatus,
      customerProgrammeId: customizedId,
    };

    if (shouldUpdate) {
      const res = await endpoint('customizedDetail', customizedId);
      const customDetail = customDetailMapper(res.single);
      const selectedType = {
        layoutId: customDetail.layoutId,
        name: customDetail.name,
      };
      Object.assign(data, { customStep: 2, customDetail, selectedType })
    }
    const res = await endpoint('customList', houseId);
    Object.assign(data, { houseTypes: res.list.map(houseTypesMapper) })

    this.setData(data);

    if (this.showGuide()) {
      this.setData({ popup: true, guide: true });
    }
  },

  showGuide() {
    const popup = wx.getStorageSync(CUSTOM_POP_UP);
    const { customizedStatus } = this.data;
    console.log('customizedStatus', customizedStatus);
    return !popup && !customizedStatus;
  },

  async onShow() {
    // if (this.showGuide()) {
    //   this.setData({ popup: true, guide: true });
    // }
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
    const res = await endpoint('customDetail', {
      customizedLayoutId: this.data.selectedType.layoutId,
      houseId: this.data.houseId,
      customerId: this.data.customerId,
    });
    console.log('res', res);
    this.setData({
      customStep: 2,
      customDetail: res.single,
      customerProgrammeId: res.single.customerProgrammeId,
    });
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

  async onHouseTypeDidUpdate(e) {
    const { detail: { update } } = e;
    const data = { houseTypeUpdate: false };
    if (update) {
      const { houseId, customerId, customerProgrammeId } = this.data;
      const res = await endpoint('customDetail', {
        houseId,
        customerId,
        customerProgrammeId,
        customizedLayoutId: this.data.selectedType.layoutId,
      });
      Object.assign(data, { customDetail: res.single });
    }
    this.setData(data);
  },

  async editSpace(e) {
    if (!e) return;
    const { currentTarget: { dataset: { space } } } = e;
    const { customDetail, houseId, spaceNames, selectedType } = this.data;
    const res = await endpoint('spaceList', {
      houseId,
      customizedLayoutId: selectedType.layoutId
    });
    const spaceTypes = res.list.map(spaceTypeMapper);
    const selectedSpace = spaceTypes.find((item) => item.id === space.spaceTypeId);
    spaceTypes.forEach((item) => {
      if (item.id === space.spaceTypeId) {
        item.selected = true;
      }
      item.subTypes.forEach((sub) => {
        const defaultSp = customDetail.spaces.find((t) => t.spaceTypeId === sub.spaceTypeId);
        if (sub.id === defaultSp.id) {
          sub.selected = true;
          spaceNames[item.id] = sub.name;
        }
      });
    });
    this.setData({
      spaceEdit: true,
      spaceTypes,
      spaceNames,
      selectedSpace,
    });
  },

  onSelectSpaceChange(e) {
    const event = e.detail && e.detail.currentTarget ? e.detail : e;
    const { currentTarget: { dataset: { type } } } = event;
    const { spaceTypes: spTypes } = this.data;
    const selectedSpace = spTypes.find((item) => item.id === type);
    spTypes.forEach((item) => {
      item.selected = item.id === type;
    });
    this.setData({
      spaceTypes: spTypes,
      selectedSpace,
    });
  },

  onSelectSubSpaceChange(e) {
    const event = e.detail && e.detail.currentTarget ? e.detail : e;
    const { currentTarget: { dataset: { type } } } = event;
    const { selectedSpace, spaceTypes, spaceNames } = this.data;
    const spType = spaceTypes.find((item) => item.id === selectedSpace.id);
    spType.subTypes.forEach((item) => {
      item.selected = item.id === type;
    });
    const sub = spType.subTypes.find((item) => item.id === type);
    spaceNames[selectedSpace.id] = sub.name;
    this.setData({
      selectedSpace: spType,
      spaceNames,
    });
  },

  async onSpaceDidUpdate(e) {
    const { customerProgrammeId, houseId, customerId } = this.data;
    const { detail: { update } } = e;
    const data = { spaceEdit: false };
    if (update) {
      const spaceId = []; 
      this.data.spaceTypes.forEach((item) => {
        item.subTypes.forEach((sub) => {
          if (sub.selected) {
            spaceId.push(sub.id);
          }
        });
      });
      const spaceIds = spaceId.join('_');
      const res = await endpoint('customDetail', {
        customerProgrammeId,
        spaceIds,
        houseId,
        customerId,
        customizedLayoutId: this.data.selectedType.layoutId,
      });
      Object.assign(data, { customDetail: res.single });
    }
    this.setData(data);
  },

  onComment() {
    console.log('onComment', this.data.commentMode);
    const data = { commentMode: !this.data.commentMode };
    if (this.data.commentMode) {
      Object.assign(data, { commentExpand: false });
    }
    this.setData(data);
  },

  async sendComment() {
    let { inputComment } = this.data;
    inputComment = inputComment.trim();
    if (inputComment.length) {
      const { commentList, customerId, customerProgrammeId, houseId  } = this.data;
      const res = await endpoint('addComment', {
        customerId,
        commentText: inputComment,
        customerProgrammeId,
        houseId,
        orderNo: 1
      })
      const comment = {
        id: res.id,
        content: inputComment,
      };
      commentList.unshift(comment);
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

  async delComment(e) {
    console.log(this.data.commentMode);
    if (!this.data.commentMode) {
      return;
    }
    const { currentTarget: { dataset: { index, id } } } = e;
    const { commentList: newList, customerId, houseId } = this.data;
    newList.splice(index, 1);
    endpoint('updateComment', {
      customerId,
      customerProgrammeId: 0,
      houseId,
      id,
      status: -1
    })
    this.setData({ commentList: newList });
  },

  async onSaveCustom() {
    const { customerProgrammeId } = this.data;
    const res = await endpoint('saveCustom', {
      // commentImageUrl: 'https://xxx/canvas',
      customerId: this.data.customerId,
      customizedProgrammeId: this.data.selectedType.id,
      houseId: this.data.houseId,
      id: customerProgrammeId,
      customizedStatus: 1,
    });

    if (res.success) {
      wx.navigateTo({ url: '/pages/person-info/person-info' });
    }
  },

  toggleExpand() {
    const { commentExpand } = this.data;
    this.setData({ commentExpand: !commentExpand });  
  },

});
