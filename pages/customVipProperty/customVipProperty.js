import endpoint from '../../lib/endpoint';
import regeneratorRuntime from '../../lib/runtime';
import { login, uploadImageFiles } from '../../lib/promise';

const cdn = 'http://pjrpw22gp.bkt.clouddn.com';

const list = [
  { 
    id: 1,
    icon: `${cdn}/buy.png`,
    text: '优先购房',
  },
  { 
    id: 2,
    icon: `${cdn}/immigrant.png`,
    text: '移民咨询',
  },
  { 
    id: 3,
    icon: `${cdn}/i-design.png`,
    text: '专属设计',
  },
  { 
    id: 4,
    icon: `${cdn}/i-discount.png`,
    text: '私享折扣',
  },
  { 
    id: 5,
    icon: `${cdn}/service.png`,
    text: '专线服务',
  }
];

Page({
  data: {
    cdn,
    list,
    urls: [],
  },

  async onLoad(params) {
    const { adviserId } = params;
    const data = await login();
    const { id: customerId, houseId } = data;
    this.setData({ customerId, houseId });
  },

  onChooseImage() {
    const that = this;
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        console.log('tempFilePaths', tempFilePaths);
        that.upload(tempFilePaths);
      }
    })
 
  },

  async upload(files) {
    const uploadRes = await endpoint('getUploadToken');
    const { token, resultUrl } = uploadRes.single;
    const qnkey = await uploadImageFiles(token, files[0]);
    console.log('qnkey', qnkey);
    const qnUrl = `${resultUrl}${qnkey}`;
    console.log('qnUrl', qnUrl);
    const { urls } = this.data;
    urls.push(qnUrl);
    this.setData({ urls });
  },

  async onSubmit() {
    const { urls, customerId, houseId, adviserId } = this.data;
    const res = await endpoint('propertyAuth', {
      assetCertificationImageList: urls,  
      customerId,
      houseId,
      updator: customerId,
    });

    if (res.success) {
      const url = `/pages/chat/chat?adviserId=${adviserId}`;
      wx.navigateTo({ url });
    } else {
      wx.showToast({ title: res.message });
    }
  },
})