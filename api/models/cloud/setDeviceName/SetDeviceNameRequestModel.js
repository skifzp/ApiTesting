export default class SetDeviceNameRequestModel {
	constructor(payload) {
		this.name = payload?.name;
	}

	setName(name) {
		this.name = name;
		return this;
	}
}
