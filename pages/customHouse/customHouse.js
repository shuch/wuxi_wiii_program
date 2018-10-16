import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { houseTypesMapper, spaceTypeMapper, customDetailMapper } from '../../utils/convertor';
import { login, getImageInfo, uploadImageFiles } from '../../lib/promise';

const cdn = 'http://oh1n1nfk0.bkt.clouddn.com';
const CUSTOM_POP_UP = 'CUSTOM_POP_UP';

Page({
  data: {
    selectedType: null,
    spaceNames: {},
    customStep: 1,
    popup: false,
    guide: false,
    houseTypeUpdate: false,
    spaceEdit: false,
    commentMode: false,
    drawMode: false,
    commentList: [],
    inputComment: '',
    coverTip: 1,
    cdn,
    commentExpand: false,
    canvasHeight: 450,
    canvasWidth: 375,
    lineWidth: 2,
    lineColor: '#FFA546',
  },

  async onLoad(parmas) {
    console.log('onLoad', parmas);
    const appData = await login();
    const { id: customerId, houseId } = appData;
    const { update, create, id, fromCenter } = parmas;
    const state = await endpoint('customState', { customerId, houseId });
    const {
      single: {
        customizedStatus,
        paymentStatus,
        customerProgrammeId,
        customerSupplementStatus,
      },
    } = state;

    // 有暂存方案或编辑方案
    const customizedId = update ? id : customerProgrammeId;
    const unFinished = !customizedStatus && customerProgrammeId;
    const shouldUpdate = unFinished || update;
    const hasPay = paymentStatus === 2;
    const finishOne = customizedStatus || hasPay;
    const redirectCenter = finishOne && !update && !create && !fromCenter;
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
    console.log('customizedId', customizedId);
    if (shouldUpdate) {
      const res = await endpoint('customizedDetail', customizedId);
      const customDetail = customDetailMapper(res.single);
      const selectedType = {
        // id: 
        layoutId: customDetail.layoutId,
        name: customDetail.name,
      };
      Object.assign(data, { customStep: 2, customDetail, selectedType, commentList: customDetail.comments })
    }
    const res = await endpoint('customList', houseId);
    Object.assign(data, { houseTypes: res.list.map(houseTypesMapper), customerSupplementStatus })

    this.setData(data);

    if (this.showGuide()) {
      this.setData({ popup: true, guide: true });
    }
  },

  showGuide() {
    const popup = wx.getStorageSync(CUSTOM_POP_UP);
    const { customizedStatus } = this.data;
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

  isOperating() {
    const { commentMode, drawMode } = this.data;
    return commentMode || drawMode;
  },

  onHouseTypeUpdate() {
    if (this.isOperating()) {
      return;
    }
    this.setData({ houseTypeUpdate: true, preHouseType: this.data.selectedType });
  },

  async onStep() {
    if (!this.data.selectedType) return;
    const res = await endpoint('customDetail', {
      customizedLayoutId: this.data.selectedType.layoutId,
      houseId: this.data.houseId,
      customerId: this.data.customerId,
    });
    this.setData({
      customStep: 2,
      customDetail: res.single,
      customerProgrammeId: res.single.customerProgrammeId,
      customizedProgrammeId: res.single.id,
    });
  },

  onKnown() {
    wx.setStorageSync(CUSTOM_POP_UP, 1);
    this.setData({ popup: false });
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
      Object.assign(data, { customDetail: res.single, customizedProgrammeId: res.single.id });
    } else {
      Object.assign(data, { selectedType: this.data.preHouseType });
    }
    this.setData(data);
  },

  async editSpace(e) {
    if (this.isOperating()) {
      return;
    }
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
      Object.assign(data, { customDetail: res.single, customizedProgrammeId: res.single.id });
    }
    this.setData(data);
  },

  onComment() {
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
        commentText: inputComment,
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
    const { customerProgrammeId, drawUrl, customizedProgrammeId, customerSupplementStatus } = this.data;
    const res = await endpoint('saveCustom', {
      commentImageUrl: drawUrl,
      customerId: this.data.customerId,
      customizedProgrammeId,
      houseId: this.data.houseId,
      id: customerProgrammeId,
      customizedStatus: 1,
    });
    console.log('onSaveCustom', res, customerSupplementStatus);
    if (res.success) {
      if (customerSupplementStatus) {
        wx.navigateTo({ url: '/pages/customCenter/customCenter' });
      } else {
        wx.navigateTo({ url: '/pages/person-info/person-info' });
      }
    }
  },

  toggleExpand() {
    const { commentExpand } = this.data;
    this.setData({ commentExpand: !commentExpand });  
  },

  onPreview() {
    if (this.isOperating()) {
      return;
    }
    const src = this.data.customDetail.imageUrl;
    wx.previewImage({
      urls: [src],
      current: src,
    })
  },

  async onDraw() {
    // 绘制图片到画布
    const { customDetail: { imageUrl }, canvasHeight, canvasWidth } = this.data;
    const res = await getImageInfo(imageUrl);
    const { height, width, path } = res;
    let initRatio = height / canvasHeight;
    if (initRatio < width / canvasHeight) {
      initRatio = width / canvasWidth;
    }
    const scaleWidth = width / initRatio;
    const scaleHeight = height / initRatio;
    const startX = -scaleWidth / 2;
    const startY = -scaleHeight / 2;
    console.log('scaleWidth', scaleWidth);
    console.log('scaleHeight', scaleHeight);

    const ctx = wx.createCanvasContext('draw');
    ctx.translate(canvasWidth / 2, canvasHeight / 2) //原点移至中心，保证图片居中显示
    ctx.drawImage(path, startX, startY, scaleWidth, scaleHeight);
    ctx.draw();
    this.ctx = ctx;
    this.scaleWidth = scaleWidth;
    this.scaleHeight = scaleHeight;
    this.startX = startX;
    this.startY = startY;
    this.setData({ drawMode: true });
    console.log('canvas', initRatio, startX, startY, scaleWidth, scaleHeight);
  },

  drawStart(e) {
    var self = this;
    const { canvasHeight, canvasWidth, lineWidth, lineColor } = this.data;
    self.lineWidth = lineWidth;
    self.lineColor = lineColor;
    self.doodleStartX = e.touches[0].x - canvasWidth / 2;
    self.doodleStartY = e.touches[0].y - canvasHeight / 2;
  },

  drawMove(e) {
    // 触摸移动，绘制中
    var self=this
    self.doodled=true;
    const { canvasHeight, canvasWidth } = this.data;
    self.ctx.setStrokeStyle(self.lineColor);
    self.ctx.setLineWidth(self.lineWidth);
    self.ctx.setLineCap('round');
    self.ctx.setLineJoin('round');
    self.ctx.moveTo(self.doodleStartX, self.doodleStartY);
    self.ctx.lineTo(e.touches[0].x - canvasWidth / 2, e.touches[0].y - canvasHeight / 2);
    self.ctx.stroke();
    self.ctx.draw(true);
    self.doodleStartX = e.touches[0].x - canvasWidth / 2
    self.doodleStartY = e.touches[0].y - canvasHeight / 2
  },

  onSaveDraw() {
    this.saveDraw();
    this.setData({ drawMode: false });
  },

  saveDraw() {
    const self = this;
    const { startX, startY, scaleHeight, scaleWidth } = this;
    const { canvasHeight, canvasWidth, customDetail: custom } = this.data;
    console.log('save', canvasWidth / 2 + startX, canvasHeight / 2 + startY, scaleHeight, scaleWidth);
    wx.canvasToTempFilePath({
      x: canvasWidth / 2 + startX,
      y: canvasHeight / 2 + startY,
      width: scaleWidth,
      height: scaleHeight,
      canvasId: 'draw',
      success: async (res) => {
       console.log('res', res.tempFilePath);
       custom.imageUrl = res.tempFilePath;
       self.setData({
          customDetail: custom,
       });
       const uploadRes = await endpoint('getUploadToken');
       const { token, resultUrl } = uploadRes.single;
       const qnkey = await uploadImageFiles(token, res.tempFilePath);
       console.log('qnkey', qnkey);
       const drawUrl = `${resultUrl}${qnkey}`;
       console.log('drawUrl', drawUrl);
       self.setData({ drawUrl });
      }
    })
  },

  async loadImage() {
    const { customDetail: { imageUrl }, canvasHeight, canvasWidth } = this.data;
    const res = await getImageInfo(imageUrl);
    // self.oldScale = 1
    const { height, width, path } = res;
    let initRatio = height / canvasHeight;
    if (initRatio < width / canvasHeight) {
      initRatio = width / canvasWidth;
    }
    //图片显示大小
    const scaleWidth = (width / initRatio)
    const scaleHeight = (height / initRatio)

    this.startX = canvasWidth / 2 - scaleWidth / 2;
    this.startY = canvasHeight / 2 - scaleHeight / 2;
    this.setData({
      imgWidth: scaleWidth,
      imgHeight: scaleHeight,
      imgTop: this.startY,
      imgLeft: this.startX
    });
    this.scaleWidth = scaleWidth;
    this.scaleHeight = scaleHeight;
    console.log('loadImage', initRatio, this.startX, this.startY, scaleWidth, scaleHeight);

  }
});
