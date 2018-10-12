import regeneratorRuntime from './runtime';

const SUCCESS_CODE = 200;
const request = requestConfig => new Promise((resolve, reject) => {
	const success = async ({ data, statusCode}) => {
        wx.hideLoading()
		if (statusCode === SUCCESS_CODE) {
			resolve(data);
		}

		const error = `http status code ${statusCode}`;
		reject(error);
	};

	const fail = (reject)=>{
        wx.hideLoading()
        reject()
	};

	const config = { ...requestConfig, success, fail };
    wx.showLoading({title:'loading...'})
	wx.request(config);
});

export default request;