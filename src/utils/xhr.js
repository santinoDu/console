const originXMLHttpRequest = window.XMLHttpRequest;
const { getOwnPropertyNames, getOwnPropertyDescriptor } = Object;

/*
* polyfill for Object.getOwnPropertyDescriptors 未考虑 symbol 属性
* */
function getOwnPropertyDescriptors(obj) {
	const descs = {};

	getOwnPropertyNames(obj).forEach(key => {
		descs[key] = getOwnPropertyDescriptor(obj, key);
	});

	return descs;
}

const propertyDescriptors = Object.getOwnPropertyDescriptors ?  Object.getOwnPropertyDescriptors(originXMLHttpRequest) : getOwnPropertyDescriptors(originXMLHttpRequest);

export default function ProxyXMLHttpRequest() {
    const xhr = new originXMLHttpRequest();

	xhr.onreadystatechange = () => {
		xhr.originOnreadystatechange && xhr.originOnreadystatechange();
		ProxyXMLHttpRequest.fn.call(null, xhr);
	};

	Object.defineProperty(xhr, 'onreadystatechange', {
		set: function (value) {
			xhr.originOnreadystatechange = value;
		}
	});

	const originOpen = xhr.open.bind(xhr);
	const originSend = xhr.send.bind(xhr);

	xhr.open = function (method, url, asynchronous, username, password) {
		xhr.open_fn_parmas = {
			method,
			url,
			asynchronous
		};
		originOpen(method, url, asynchronous, username, password);
	};
	
	xhr.send = function (data) {
		xhr.send_fn_params = {
			data
		};
		originSend(data);
	};

	return xhr;
}

for(let key in propertyDescriptors) {
	Object.defineProperty(ProxyXMLHttpRequest, key, propertyDescriptors[key]);
}

ProxyXMLHttpRequest.fn = function () {};
