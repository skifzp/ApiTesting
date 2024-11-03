import { describe } from 'mocha';
import Statuses from '../../enums/Statuses';
import { Api } from '../Api';
import {keys, tokenKeyName} from '../../keys';
import { API_ARTIFACTS_DIR, report } from '../../utils/reportUtils';
import Comparator from '../../utils/ComparatorChai';
import { UNAUTHORIZED_STATUS_TXT } from './constants';
import RandomGenerator from '../../utils/RandomGenerator';
import Tags from '../../enums/Tags';

const LOGS = {};
const api = new Api();

describe(`Call APIs without auth ${Tags.SECURITY.tag}`, async function () {
	before(async () => {
		const logger = (LOGS[this.fullTitle()] = report.logger({ fileName: this.fullTitle(), artifactsDir: API_ARTIFACTS_DIR }));
		api.createInstance();
		if (keys[tokenKeyName]) api.saveAccessToken({data: {[tokenKeyName]: RandomGenerator.getRandomText()}});
	});

	beforeEach(async () => {
		LOGS[this.ctx.currentTest.title] = report.logger({
			fileName: report.convertTestName(this.fullTitle(), this.ctx.currentTest.title),
			artifactsDir: API_ARTIFACTS_DIR,
		});
	});

	it('GET /device/name', async function () {
		const logger = LOGS[this.test.title];
		const response = await api.device.getDeviceName(logger, Statuses.UNAUTHORIZED.value);
		await checkUnauthorizedResponse(logger, response);
	});

	it('POST /device/{name}', async function () {
		const logger = LOGS[this.test.title];
		const response = await api.cloud.setDeviceName(logger, RandomGenerator.getRandomText(), null, Statuses.UNAUTHORIZED.value);
		await checkUnauthorizedResponse(logger, response);
	});
});

async function checkUnauthorizedResponse(logger, response) {
	await Comparator.eql(logger, response.status, Statuses.UNAUTHORIZED.value, 'Status code');
	await Comparator.eql(logger, response.statusText, UNAUTHORIZED_STATUS_TXT, 'Status text');
}
