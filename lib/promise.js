const app = getApp();

export const login = () => {
	return new Promise((resolve) => {
		app.login(() => {
			const data = app.globalData.single;
			resolve(data);
		});
	});
}

export const getImageInfo = (src) => {
	return new Promise((resolve) => {
		const success = resolve;
		const config = { src, success };
		wx.getImageInfo(config);
	})
}

export const uploadImageFiles = (token, filePath) => {
  const key = Math.random().toString(36).substr(2); //生成一个随机字符串的文件名
  return new Promise((resolve) => {
    wx.uploadFile({
      url: 'https://upload.qiniup.com',
      filePath: filePath,
      name: 'file',
      formData: {
        token,
        key,
      },
      success: (data) => {
        let res;
        try {
          res = JSON.parse(data.data);
        } catch (e) {
          res = data.data;
        }
        // const key = res.key;
        resolve(res.key);
      }
    });
  });
};

export const getSetting = () => {
  return new Promise((resolve) => {
    //获取相册授权
    wx.getSetting({
      success(res) {
        resolve(res.authSetting);
      },
      fail(res){
        reject();
      },
    });
  });
}

export const savePhoneAuth = () => {
  return new Promise((resolve) => {
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        resolve(true);
        return true;
      },
      fail() {
        resolve(false);
        return false;
      },
    });
  })
}