import Mocha from 'mocha';
import moment from 'moment-timezone';
import { API_ARTIFACTS_DIR, EXTENSION, report } from '../utils/reportUtils';
import FileUtils from '../utils/FileUtils';

const BEFORE_EACH_HOOK = '"before each" hook';
const AFTER_EACH_HOOK = '"after each" hook';
const DURATION_BEFORE_EACH = {};

const { EVENT_RUN_BEGIN, EVENT_RUN_END, EVENT_TEST_END, EVENT_TEST_BEGIN, EVENT_TEST_FAIL, EVENT_HOOK_BEGIN, EVENT_HOOK_END, EVENT_SUITE_BEGIN, EVENT_SUITE_END } = Mocha.Runner.constants;

export default class MochaReporter {
	constructor(runner) {
		this.startedTime = moment(new Date()).format('YYYY-MM-DD_HH-mm-ss');

		runner
			.once(EVENT_RUN_BEGIN, () => {
				const files = report.getAllReports(EXTENSION, API_ARTIFACTS_DIR);
				for (let f = 0; f < files.length; f++) {
					const log = report.logger({ fileName: files[f], ext: '', artifactsDir: API_ARTIFACTS_DIR });
					report.delete(log); // delete log of previous running
				}
			})
			.on(EVENT_SUITE_BEGIN, (suite) => {
				if (suite.title) {
					const logger = report.logger({ fileName: suite.title, artifactsDir: API_ARTIFACTS_DIR });
					report.step(logger, `${suite.title}`);
				}
			})
			.on(EVENT_SUITE_END, (suite) => {
				let logger;
				if (!suite.title) {
					const suites = suite.suites;
					for (let s = 0; s < suites.length; s++) {
						const tests = suites[s].tests;
						const fixture = report.validFileName(suites[s].title);
						logger = report.logger({ fileName: fixture, artifactsDir: API_ARTIFACTS_DIR });
						report.moveToArchive(logger, `logs/${this.startedTime}/${fixture}`);
						for (let t = 0; t < tests.length; t++) {
							const file = report.convertTestName(suites[s].title, tests[t].title);
							logger = report.logger({ fileName: file, artifactsDir: API_ARTIFACTS_DIR });
							report.moveToArchive(logger, `logs/${this.startedTime}/${fixture}`);
						}
					}
				}
			})
			.on(EVENT_HOOK_BEGIN, (hook) => {
				const key = report.convertTestName(hook.parent.title, hook.ctx.currentTest.title);
				const logger = report.logger({
					fileName: key,
					artifactsDir: API_ARTIFACTS_DIR,
					level: 1,
				});
				if (hook.originalTitle === BEFORE_EACH_HOOK) {
					report.started(logger, BEFORE_EACH_HOOK);
				}
				if (hook.originalTitle === AFTER_EACH_HOOK) {
					report.started(logger, AFTER_EACH_HOOK);
				}
			})
			.on(EVENT_TEST_BEGIN, (test) => {
				const key = report.convertTestName(test.parent.title, test.title);
				if (Object.keys(DURATION_BEFORE_EACH).filter((k) => k === key).length) return;
				const logger = report.logger({
					fileName: key,
					artifactsDir: API_ARTIFACTS_DIR,
					level: 1,
				});
				report.started(logger);
			})
			.on(EVENT_TEST_FAIL, (test, err) => {
				const logger = report.logger({
					fileName: report.convertTestName(test.parent.title, test.title),
					artifactsDir: API_ARTIFACTS_DIR,
				});
				report.step(logger, err);
			})
			.on(EVENT_TEST_END, (test) => {
				const key = report.convertTestName(test.parent.title, test.title);
				const logger = report.logger({ fileName: key, artifactsDir: API_ARTIFACTS_DIR });
				if (FileUtils.isExist(`${logger.artifactsDir}/${key}${logger.ext}`)) {
					report.step(logger, `Duration of test is ${test.duration}`);
				}
			})
			.on(EVENT_HOOK_END, (hook) => {
				const key = report.convertTestName(hook.parent.title, hook.ctx.currentTest.title);
				const logger = report.logger({ fileName: key, artifactsDir: API_ARTIFACTS_DIR });
				if (hook.originalTitle === BEFORE_EACH_HOOK) {
					report.step(logger, `Duration of ${BEFORE_EACH_HOOK} : ${hook.duration}`);
					DURATION_BEFORE_EACH[key] = hook.duration;
				}
				if (hook.originalTitle === AFTER_EACH_HOOK) {
					report.step(logger, `Duration of ${AFTER_EACH_HOOK} : ${hook.duration}`);
				}
			})
			.once(EVENT_RUN_END, () => {});
	}
}
