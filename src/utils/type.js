export default function isError(value) {
	return Object.prototype.toString.call(value) === '[object Error]';
}