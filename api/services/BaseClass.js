import axios from 'axios';
import https from 'https';
import { ConfigModelForExpectedStatus, ConfigModelForNonExpectedStatus } from '../ConfigModel';
import { SELECTED_ENV } from '../../config';
import { tokenKeyName, keys } from '../../keys';
import { API_TIMEOUT } from '../config';
import Statuses from '../../enums/Statuses';
import { report } from '../../utils/reportUtils';

export default class BaseClass {
	static REQUEST_HEADER_CONTENT_TYPE_JSON = 'application/json';

	constructor(config = SELECTED_ENV) {
		this.agent = new https.Agent({
			rejectUnauthorized: config.rejectUnauthorized,
		});
	}

	setInstances(instance) {
		this.instance = instance;
	}

	throwError(logger, response, status, attemptNumber = 1) {
		const content =
			`Attempt number is ${attemptNumber}, expected status is ${status} but actual is ${response.status}\n` +
			(typeof response.data === 'string'
				? `Response : ${response.data
						.replace(/<[^>]+>/g, '')
						.replace(/\n/g, ' ')
						.replace(/[ ]{2,}/g, ' ')}`
				: response.status !== Statuses.SUCCESS.value
					? `Response : ${JSON.stringify(response.data, null, 4)}`
					: ``) +
			`\n` +
			`Config :\n ${JSON.stringify(new ConfigModelForNonExpectedStatus(response.config), null, 4)}`;
		throw new Error(content);
	}

	printLog(logger, response, attemptNumber = 1) {
		const content = `Attempt number is ${attemptNumber}, status was as expected : ${response.status}\n` + `Config :\n ${JSON.stringify(new ConfigModelForExpectedStatus(response.config), null, 4)}`;
		report.step(logger, content);
	}

	printAttemptLog(logger, response, attemptNumber) {
		const content = `Attempt number is ${attemptNumber}, status is ${response.status}\n` + `Config :\n ${JSON.stringify(new ConfigModelForExpectedStatus(response.config), null, 4)}`;
		report.step(logger, content);
	}

	checkResponseStatus(logger, response, expectedStatus, attemptNumber = 1) {
		if (response.status !== expectedStatus) {
			this.throwError(logger, response, expectedStatus, attemptNumber);
		} else {
			this.printLog(logger, response, attemptNumber);
		}
	}

	apiResponse(logger, response, expectedStatus) {
		this.checkResponseStatus(logger, response, expectedStatus);
		return response;
	}

	createInstance = () => {
		this.instance = axios.create({
			validateStatus: false,
			timeout: API_TIMEOUT,
			httpsAgent: this.agent,
			headers: { 'Content-Type': BaseClass.REQUEST_HEADER_CONTENT_TYPE_JSON },
		});

		this.instance.interceptors.request.use(
			async (config) => {
				if (keys[tokenKeyName]) config.headers['Authorization'] = keys[tokenKeyName];
				return config;
			},
			(error) => Promise.reject(error)
		);

		this.setInstances(this.instance);
	}

	loginWrapper = async (logger, payload, baseUrl, expectedStatus = Statuses.SUCCESS.value, attemptsNumber = 1) => {
		if (keys[tokenKeyName]) {
			report.step(logger, 'Api : Use existing token');
			return;
		}

		report.step(logger, `API : login as user ${payload.username}`);
		let response = await this.instance.post('/auth/login', payload, { baseURL: baseUrl });

		let attempt = 1;
		if (expectedStatus === Statuses.SUCCESS.value) {
			while (response.status !== expectedStatus && attempt <= attemptsNumber) {
				this.printAttemptLog(logger, response, attempt);
				response = await this.instance.post('/auth/login', payload, { baseURL: baseUrl });
				attempt++;
			}
		}
		this.checkResponseStatus(logger, response, expectedStatus, attempt);
		this.saveAccessToken(response);
		return response;
	}

	saveAccessToken(response) {
		const accessToken = response.data[tokenKeyName];
		keys[tokenKeyName] = `Bearer ${accessToken}`;
	}

	setContentType = (payload) => {
		if (payload?.contentType) {
			this.instance.defaults.headers.common['Content-Type'] = payload.contentType;
			payload.contentType = undefined;
		}
	}
}
