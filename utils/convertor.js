import { getDate, getTime } from './date';

export const houseTypesMapper = (item) => {
	const {
		id,
		houseId,
		layoutId,
        thumbnail,
        chooseImage,
		senceImage,
		area,
		type,
		name,
        floor:height,
	} = item;
	const areaNum = parseInt(area);
	return {
		id,
		houseId,
		area: areaNum,
		name,
		height,
		layoutId,
        chooseImage,
		thumb: senceImage,
		thumbSm: thumbnail,
	};
}

export const spaceTypeMapper = (item) => {
	const {
		id,
		name,
		spaces,
	} = item;
	return {
		id,
		name,
		subTypes: spaces,
	};
}

export const rankMapper = (item) => {
	const {
		id,
		senceImage,
		isThumbsUp,
		thumbsUpNo = 0,
		avatar = '',
		name,
		spaces,
		originCustomer,
		orderNo,
	} = item;
	const like = thumbsUpNo ? thumbsUpNo : 0;
	const isLike = isThumbsUp;
	let spaceList = spaces || [];
	spaceList = spaceList.map(item => item.name);
	const special = [name, ...spaceList];
	const { nickname, headPortrait } = originCustomer || {};
	const owner = {
		name: nickname || '',
		avatar: headPortrait || '',
	};
	const rank = orderNo || '';
	return {
		id,
		src: senceImage,
		like,
		avatar,
		name,
		special,
		owner,
		isLike,
		rank,
	};
}

export const customDetailMapper = (data) => {
	const { thumbsUpCustomerList: likes } = data;
	return {
		...data,
		likes,
		imageUrl: data.commentImageUrl,
	};
}

export const customizedMapper = (item) => {
	const updated = item.updated || item.created;
	const date = getDate(updated);
	const like = item.thumbsUpNo || 0;
	const isLike = item.isThumbsUp;
	const space = item.spaces.map(item => item.name);
	const special = [item.name, ...space];
	const rank = item.orderNo || '';
	return {
		...item,
		rank,
		date,
		like,
		isLike,
		special,
	};
}

export const processMapper = (item) => {
	const { date: ts } = item;
	const date = getDate(ts);
	const time = getTime(ts);
	return {
		...item,
		date,
		time,
	};
}