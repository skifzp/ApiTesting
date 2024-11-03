export default class ErrorModel {
	constructor(e) {
		this.message = e.message || e.statusText;
		this.statusCode = e.statusCode || e.status;
		this.code = e.code;
	}
}
