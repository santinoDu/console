/*
* https://github.com/werk85/fetch-intercept/blob/develop/src/index.js
* 对改代码进行修改, 用以支持拦截 fetch 请求, 记录请求
* */
attach(window);

function attach(env) {
	env.fetch = (function (fetch) {
		return function (...args) {
			let req = new Request(...args);
			return interceptor(fetch, req);
		};
	})(env.fetch);
}

let interceptors = [];

function interceptor(fetch, req) {
	const reversedInterceptors = interceptors.reduce((array, interceptor) => [interceptor].concat(array), []);
	let promise = Promise.resolve(req);

	// Register request interceptors
	reversedInterceptors.forEach(({ request, requestError }) => {
		if (request || requestError) {
			promise = promise.then(req => request(req), requestError);
		}
	});

	// Register fetch call
	promise = promise.then(req => {
		return new Promise((resolve, reject) => {
			fetch(req).then(res => {
				resolve({request: req, response: res});
			}).catch(err => {
				reject({request: req, responseError: err});
			});
		});
	});

	// Register response interceptors
	reversedInterceptors.forEach(({ response, responseError }) => {
		if (response || responseError) {
			promise = promise.then(response, responseError);
		}
	});

	return promise;
}

export default {
	register: function (interceptor) {
		interceptors.push(interceptor);
		return () => {
			const index = interceptors.indexOf(interceptor);
			if (index >= 0) {
				interceptors.splice(index, 1);
			}
		};
	},
	clear: function () {
		interceptors = [];
	}
};
