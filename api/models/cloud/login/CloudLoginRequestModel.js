export default class CloudLoginRequestModel {
	constructor(payload) {
		this.username = payload?.username;
		this.password = payload?.password;
	}
}
