import { enumUtils } from './EnumUtils';

export default class Statuses {
	static SUCCESS = new Statuses(200);
	static CREATED = new Statuses(201);
	static NOT_MODIFIED = new Statuses(301);
	static BAD_REQUEST = new Statuses(400);
	static UNAUTHORIZED = new Statuses(401);
	static FORBIDDEN = new Statuses(403);
	static NOT_FOUND = new Statuses(404);
	static INTERNAL_SERVER = new Statuses(500);
	static BAD_GATEWAY = new Statuses(502);

	constructor(code) {
		this.value = code;
	}

	static getValues() {
		return enumUtils.getValues(Statuses);
	}
}
