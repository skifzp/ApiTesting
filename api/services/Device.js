import {DEVICE_IP_KEY} from '../../config';
import Statuses from '../../enums/Statuses';
import {API_URL_PART} from '../config';
import BaseClass from './BaseClass';

export default class Device extends BaseClass {
	constructor(config) {
		super(config);
		this.baseURL = `${config[DEVICE_IP_KEY]}/${API_URL_PART}`;
	}

	login = async (logger, payload = null, expectedStatus = Statuses.SUCCESS.value) => {
		const res = await this.instance.post(`/auth/login`, payload, { baseURL: this.baseURL });
		return this.apiResponse(logger, res, expectedStatus);
	}

	getDeviceName = async (logger, expectedStatus = Statuses.SUCCESS.value) => {
		const res = await this.instance.get(`/device/name`, { baseURL: this.baseURL });
		return this.apiResponse(logger, res, expectedStatus);
	}
}
