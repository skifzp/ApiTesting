import { describe } from 'mocha';
import { Api } from '../../../Api';
import Users from '../../../../enums/Users';
import { API_ARTIFACTS_DIR, report } from '../../../../utils/reportUtils';
import Comparator from '../../../../utils/ComparatorChai';
import Statuses from '../../../../enums/Statuses';
import {SELECTED_ENV, CLOUD_URL_KEY} from '../../../../config';
import { tokenKeyName, keys } from '../../../../keys';
import { API_NUMBER_OF_LOGIN_ATTEMPTS } from '../../../config';
import Tags from '../../../../enums/Tags';
import CloudLoginRequestModel from '../../../models/cloud/login/CloudLoginRequestModel';
import SetDeviceNameRequestModel from '../../../models/cloud/setDeviceName/SetDeviceNameRequestModel';

const LOGS = {};
const api = new Api();

describe(`Set Device Name ${Tags.CLOUD.tag}`, async function () {
	before(async () => {
		const logger = report.logger({ fileName: `${this.fullTitle()}`, artifactsDir: API_ARTIFACTS_DIR });
		api.createInstance();
		if (!keys[tokenKeyName]) await api.loginWrapper(logger, new CloudLoginRequestModel(Users.ADMIN), SELECTED_ENV[CLOUD_URL_KEY], Statuses.SUCCESS.value, API_NUMBER_OF_LOGIN_ATTEMPTS);
	});

	beforeEach(async () => {
		LOGS[this.ctx.currentTest.title] = report.logger({
			fileName: report.convertTestName(this.fullTitle(), this.ctx.currentTest.title),
			artifactsDir: API_ARTIFACTS_DIR,
		});
	});

	after(async () => {
		const logger = (LOGS[this.ctx.currentTest.title] = report.logger({
			fileName: report.convertTestName(this.fullTitle(), this.ctx.currentTest.title),
			artifactsDir: API_ARTIFACTS_DIR,
		}));
	});

	it(`With new name as old one`, async function () {
		const logger = LOGS[this.test.title];
		const oldDeviceName = await api.device.getDeviceName(logger);

		const apiPayload = new SetDeviceNameRequestModel().setName(oldDeviceName);
		const apiResponse = await api.cloud.setDeviceName(logger, oldDeviceName, apiPayload);
		await Comparator.eql(logger, apiResponse.data.length, 0, 'Data length');

		const newDeviceName = await api.device.getDeviceName(logger);
		await Comparator.eql(logger, newDeviceName, oldDeviceName, 'New device name is equal to old one');
	});
});
