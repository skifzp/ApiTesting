import {CLOUD_URL_KEY} from '../../config';
import Statuses from '../../enums/Statuses';
import {API_URL_PART} from '../config';
import BaseClass from './BaseClass';

export default class Cloud extends BaseClass {
	constructor(config) {
		super(config);
		this.baseURL = `${config[CLOUD_URL_KEY]}/${API_URL_PART}`;
	}

	login = async (logger, payload = null, expectedStatus = Statuses.SUCCESS.value) => {
		const res = await this.instance.post(`/auth/login`, payload, { baseURL: this.baseURL });
		return this.apiResponse(logger, res, expectedStatus);
	}

	setDeviceName = async (logger, deviceName, payload = null, expectedStatus = Statuses.SUCCESS.value) => {
		const res = await this.instance.post(`/device/${deviceName}`, payload, { baseURL: this.baseURL });
		return this.apiResponse(logger, res, expectedStatus);
	}
}
