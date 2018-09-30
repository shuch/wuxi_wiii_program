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
};

const env = 'dev';

const hosts = {
	dev: 'http://139.196.5.59:5312'
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