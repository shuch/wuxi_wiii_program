const app = getApp();

export const login = () => {
	return new Promise((resolve) => {
		app.login(() => {
			const data = app.globalData;
			resolve(data);
		});
	});
}