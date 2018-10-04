export const randomString = (len = 32) => {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = $chars.length;
  let pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

export const objectToQueryStr = (obj) => {
  return Object.keys(obj)
    .filter(key => obj[key] !== '' && obj[key] !== null)
    .map((key, index) => {
      var startWith = index === 0 ? '' : '&';
      return startWith + key + '=' + obj[key];
    }).join('');
};