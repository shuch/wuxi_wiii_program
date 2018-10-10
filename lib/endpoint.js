import request from './request';
import regeneratorRuntime from './runtime';

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
	customDetail: ({ customizedLayoutId, houseId, spaceIds, customerId }) => ({
		path: '/customized/programme/detailAndSave',
		data: { customizedLayoutId, houseId, spaceIds, customerId  },
		method: 'POST',
	}),
	customizedDetail: (id) => ({
		path: '/customer/programme/detailById',
		data: { id },
		method:'POST',
	}),
	spaceList: (houseId) => ({
		path: '/customized/SpaceTypeType/listWithSpaceList',
		data: { houseId },
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
		path: '/ticket/queryCustomerTicket',
		data,
		method: 'POST',
	}),
	invite: (data) => ({
		path: '/ticket/queryTicketInvite',
		data,
		method: 'POST',
	}),
	refund: (data) => ({
		path: '/wxpay/refundOrder',
		data,
		method: 'POST',
	}),
};

const env = 'dev';

const hosts = {
	dev: 'http://139.196.5.59:5313'
};

const getHost = () => hosts[env];

export default async (endpoint, ...options) => {
	if (!endpoints.hasOwnProperty(endpoint)) {
		console.error(`no such endpoint: ${endpoint}`);
		return;
	}
	const requestOptions = endpoints[endpoint].apply(null, options);
	requestOptions.url = getHost() + requestOptions.path;
	const response = await request(requestOptions);
	return response;
}