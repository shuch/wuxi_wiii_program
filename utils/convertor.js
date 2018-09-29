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