export const formatDateTs = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${year}-${padStr(month)}-${padStr(day)} ${hour}:${padStr(minute)}`
}

export const getDate = (ts) => {
	const date = new Date(ts);
	const year = date.getFullYear();
	const month = date.getMonth()+1;
	const day = date.getDate();
	return `${year}-${padStr(month)}-${padStr(day)}`;
}

export const getTime = (ts) => {
	const date = new Date(ts);
	const hour = date.getHours();
	const minute = date.getMinutes();
	return `${padStr(hour)}:${padStr(minute)}`
}

const padStr = (val) => {
  return val < 10 ? `0${val}` : val;
}