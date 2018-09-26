import regeneratorRuntime from './runtime';

const SUCCESS_CODE = 200;
const request = requestConfig => new Promise((resolve, reject) => {
	const success = async ({ data, statusCode}) => {
		if (statusCode === SUCCESS_CODE) {
			resolve(data);
		}

		const error = `http status code ${statusCode}`;
		reject(error);
	};

	const fail = reject;

	const config = { ...requestConfig, success, fail };
	wx.request(config);
});

export default request;