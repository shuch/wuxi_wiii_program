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
		commentImageUrl,
		thumbsUpNo = 0,
		avatar = '',
		name,
	} = item;
	const like = thumbsUpNo ? thumbsUpNo : 0;
	return {
		id,
		src: commentImageUrl,
		like,
		avatar,
		name,
	};
}

export const customDetailMapper = (data) => {
	return {
		...data,
		imageUrl: data.commentImageUrl,
	};
}