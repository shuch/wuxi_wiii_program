import request from './request';
import regeneratorRuntime from './runtime';
import config from '../config';

const endpoints = {
	customList: (houseId) => ({
		path: '/customized/layout/list',
		data: { houseId },
		method: "POST",
	}),
	customState: ({ customerId, houseId }) => ({
		path: '/process/getProcessStatus',
		data: { customerId, houseId },
		method: "POST",
	}),
	customDetail: (data) => ({
		path: '/customized/programme/detailAndSave',
		data,
		method: 'POST',
	}),
	customizedDetail: (id) => ({
		path: '/customer/programme/detailById',
		data: { id },
		method:'POST',
	}),
	spaceList: (data) => ({
		path: '/customized/SpaceTypeType/listByLayoutIdWithSpaceList',
		data,
		method: 'POST',
	}),
	saveCustom: (data) => ({
		path: '/customer/programme/save',
		data,
		method: 'POST',
	}),
	addComment: (data) => ({
		path: '/customer/comment/insert',
		data,
		method: 'POST',
	}),
	updateComment: (data) => ({
		path: '/customer/comment/update',
		data,
		method: 'POST',
	}),
	saveCustomInfo: (data) => ({
		path: '/customer/supplement/insert',
		data,
		method: 'POST',
	}),
	buyCard: (data) => ({
		path: '/wxpay/generateOrder',
		data,
		method: 'POST',
	}),
	customizedList: (data) => ({
		path: '/customer/programme/list',
		data,
		method: 'POST',
	}),
	rankList: (data) => ({
		path: '/customer/programme/rankPageList',
		data,
		method: 'POST',
	}),
	ticket: (data) => ({
		path: '/ticket/queryTicketInfo',
		data,
		method: 'POST',
	}),
	refund: (data) => ({
		path: '/wxpay/refundOrder',
		data,
		method: 'POST',
	}),
	restTime: (houseId) => ({
		path: '/process/getProcessDuration',
		data: { houseId },
		method: 'POST',
	}),
    designerRecommend: (houseId) => ({
		path: '/customized/programme/designerRecommend',
		data: { houseId },
		method: 'POST',
	}),
    saveDesignerRecommend: (data) => ({
		path: '/customized/programme/saveDesignerRecommend',
		data,
		method: 'POST',
	}),
  copy: (data) => ({
      path: '/customer/programme/copy',
      data,
      method: 'POST',
  }),
  customStatus: (data) => ({
  	path: '/process/getProcess',
  	data,
  	method: 'POST',
  }),
  poster: (data) => ({
  	path: '/image/create',
  	data,
  	method: 'POST',
  }),
  getUploadToken: (data) => ({
  	isQiniu: true,
  	path: '/upload/getUploadToken',
  	data,
  	method: 'POST',
  }),
 	like: (data) => ({
 		path: '/customer/programme/thumbsup',
 		data,
 		method: 'POST',
 	}),
 	delCustom: (data) => ({
 		path: '/customer/programme/update',
 		data,
 		method: 'POST',
 	}),
  addShare: (data) => ({
    path: '/ticket/addTicketInvite',
    data,
    method: 'POST',
  }),
  existNick: (data) => ({
  	path: '/customer/supplement/isNickNameExist',
  	data,
  	method: 'POST',
  }),
};

const getHost = (requestOptions) => {
	const { url, qiniuUrl } = config;
	if (requestOptions.isQiniu) {
		return qiniuUrl;
	}
	return url;
};

export default async (endpoint, ...options) => {
	if (!endpoints.hasOwnProperty(endpoint)) {
		console.error(`no such endpoint: ${endpoint}`);
		return;
	}
	const requestOptions = endpoints[endpoint].apply(null, options);
	requestOptions.url = getHost(requestOptions) + requestOptions.path;
	const response = await request(requestOptions);
	return response;
}