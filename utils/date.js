export const formatDateTs = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${year}-${padStr(month)}-${padStr(day)} ${hour}:${padStr(minute)}`
}

const padStr = (val) => {
  return val < 10 ? `0${val}` : val;
}