import Mocha from 'mocha';
import MochaReporter from './MochaReporter';
import FileUtils from '../utils/FileUtils';
import { report, API_ARTIFACTS_DIR } from '../utils/reportUtils';
import { API_TIMEOUT } from './config';
import Tags, { PREFIX, ENDING, TAGS_ARGUMENT } from '../enums/Tags';
import CLIUtils from '../utils/CLIUtils';

const cliArgs = CLIUtils.getArg(TAGS_ARGUMENT);
const tags = cliArgs ? cliArgs.split(',').map((t) => `(?=.*${PREFIX}${t}${ENDING})`) : [];

report.deleteXmls(API_ARTIFACTS_DIR);

const mocha = new Mocha({
	grep: new RegExp(tags.join('')),
	reporter: 'mocha-multi-reporters',
	reporterOptions: {
		reporterEnabled: 'spec, mocha-junit-reporter',
		mochaJunitReporterReporterOptions: {
			mochaFile: `${API_ARTIFACTS_DIR}/results${Tags.getPartOfName(tags)}.xml`,
			jenkinsMode: true,
		},
	},
}).timeout(API_TIMEOUT * 2);

FileUtils.getFileList().forEach((testFile) => mocha.addFile(testFile));

mocha.loadFilesAsync().then(async () => {
	new MochaReporter(
		mocha.run(async (failures) => {
			process.exit(failures ? 1 : 0);
		})
	);
});
