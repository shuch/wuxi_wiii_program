import { getDate, getTime } from './date';

export const houseTypesMapper = (item) => {
	const {
		id,
		houseId,
		layoutId,
		imageUrl,
		senceImage,
		area,
		type,
		name,
		height = 0,
	} = item;
	const areaNum = parseInt(area);
	return {
		id,
		houseId,
		area: areaNum,
		name,
		height,
		layoutId,
		thumb: senceImage,
		thumbSm: imageUrl,
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
		thumbsUpNo = 0,
		avatar = '',
		name,
		spaces,
		originCustomer,
	} = item;
	const like = thumbsUpNo ? thumbsUpNo : 0;
	const space = spaces.map(item => item.name);
	const special = [name, ...space];
	const { nickname = '', headPortrait = '' } = originCustomer || {};
	const owner = {
		name: nickname,
		avatar: headPortrait ,
	};
	return {
		id,
		src: senceImage,
		like,
		avatar,
		name,
		special,
		owner,
	};
}

export const customDetailMapper = (data) => {
	return {
		...data,
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
	return {
		...item,
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