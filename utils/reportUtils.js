import { openSync, unlinkSync, renameSync, appendFileSync, readdirSync, closeSync } from 'node:fs';
import path from 'path';
import moment from 'moment-timezone';
import FileUtils from './FileUtils';
import ObjectUtils from './ObjectUtils';

export const XML_REPORT_EXT = '.xml';
export const API_ARTIFACTS_DIR = 'api/artifacts';
export const EXTENSION = '.log';
export const SEPARATOR = '@';

class Logger {
	constructor({ fileName, ext, artifactsDir, printTime, level }) {
		this.fileName = fileName ? fileName : 'unnamed';
		this.ext = ext ? ext : ext === '' ? '' : EXTENSION;
		this.artifactsDir = artifactsDir ? artifactsDir : artifactsDir === '' ? '' : API_ARTIFACTS_DIR;
		this.printTime = printTime ? printTime : printTime !== false;
		this.level = level ? level : level === 0 ? 0 : 1;
	}
}

export const report = {
	logger: (config) => {
		return new Logger(config);
	},

	convertTestName: (fixtureName, testName) => {
		fixtureName = report.validFileName(fixtureName);
		testName = report.validFileName(testName);
		return `${fixtureName} ${SEPARATOR} ${testName}`;
	},

	validFileName: (name) => {
		return name.replace(/[&\/\\#,+~%":*?<>{}]/g, '');
	},

	write: (logger, content) => {
		logger.fileName = report.validFileName(logger.fileName);
		logger.ext = report.validFileName(logger.ext);
		let fd = undefined;
		try {
			FileUtils.createDir(logger.artifactsDir);
			fd = openSync(`${logger.artifactsDir}/${logger.fileName}${logger.ext}`, 'a');
			appendFileSync(fd, `${logger.printTime ? stepTime() : ''}${indent(logger.level)}${content}\n`);
		} catch (err) {
			console.log('FS_ERROR_CALL_BACK :', err);
		} finally {
			if (fd !== undefined) closeSync(fd);
		}
	},

	step: (logger, content) => {
		report.write(logger, content);
	},

	log: (logger, content) => {
		const log = ObjectUtils.clone(logger);
		log.printTime = false;
		log.level = 0;
		report.write(log, content);
	},

	started: (logger, text = '') => {
		logger.level = 1;
		report.write(logger, text ? `${text} of '${logger.fileName}' started` : `Test '${logger.fileName}' started`);
	},

	moveToArchive: (logger, newDir) => {
		try {
			const file = report.validFileName(logger.fileName + logger.ext);
			if (FileUtils.isExist(`${logger.artifactsDir}/${file}`)) {
				FileUtils.createDir(`${logger.artifactsDir}/${newDir}`);
				if (FileUtils.isExist(`${logger.artifactsDir}/${newDir}/${file}`)) {
					renameSync(`${logger.artifactsDir}/${newDir}/${file}`, `${logger.artifactsDir}/${newDir}/Before - ${file}`);
					renameSync(`${logger.artifactsDir}/${file}`, `${logger.artifactsDir}/${newDir}/After ${file}`);
				} else {
					renameSync(`${logger.artifactsDir}/${file}`, `${logger.artifactsDir}/${newDir}/${file}`);
				}
			}
		} catch (err) {
			console.log(err);
			logger.level = 0;
			report.step(logger, err);
		}
	},

	rename: (logger, newFileName, newDir = '') => {
		if (FileUtils.isExist(`${logger.artifactsDir}/${logger.fileName}${logger.ext}`)) {
			FileUtils.createDir(`${logger.artifactsDir}/${newDir}`);
			renameSync(`${logger.artifactsDir}/${logger.fileName}${logger.ext}`, `${logger.artifactsDir}${newDir ? '/' + newDir : ''}/${newFileName}`);
		}
	},

	finished: (logger, durationTime) => {
		logger.level = 1;
		report.write(logger, `Test finished (duration: ${durationTime})`);
	},

	delete: (logger) => {
		logger.fileName = report.validFileName(logger.fileName);
		logger.ext = report.validFileName(logger.ext);
		if (FileUtils.isExist(`${logger.artifactsDir}/${logger.fileName}${logger.ext}`)) {
			try {
				unlinkSync(`${logger.artifactsDir}/${logger.fileName}${logger.ext}`);
				return true;
			} catch (err) {
				console.log('FS_ERROR_CALL_BACK :', err); // if any error
				return false;
			}
		}
	},

	getAllReports: (ext = EXTENSION, inDir = E2E_ARTIFACTS_DIR) => {
		let files = [];
		if (FileUtils.isExist(inDir)) {
			try {
				inDir = inDir.toString().replaceAll('\\', '\\\\');
				files = readdirSync(inDir, { withFileTypes: true });
			} catch (err) {
				console.log(err);
			}
		}
		return files.filter((f) => f.isFile() && path.extname(f.name) === ext).map((f) => f.name);
	},

	deleteXmls: (artifactsDir = E2E_ARTIFACTS_DIR) => {
		const xmlFiles = report.getAllReports(XML_REPORT_EXT, artifactsDir);
		if (xmlFiles.length === 0) return;
		xmlFiles.forEach((xml) => {
			const logger = report.logger({ fileName: xml, ext: '' });
			report.delete(logger, artifactsDir);
		});
	},
};

const stepTime = () => {
	return moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
};

const indent = (level) => {
	let str = '';
	for (let i = 0; i < level; i++) {
		str += '  ';
	}
	return str;
};
