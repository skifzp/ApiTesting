import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { API_TEST_EXT, API_DIR } from '../api/config';

export default class FileUtils {
	static POSITIONS = {
		STARTS_WITH: 'starts',
		ENDS_WITH: 'ends',
		ANY: 'any',
	};

	/**
	 * @param dir path of main directory
	 * @param filePattern file name should include it
	 * @param position
	 * @return list of files with full their path what are located in @dir or its subdir
	 */
	static getFileList(dir = API_DIR, filePattern = API_TEST_EXT, position = FileUtils.POSITIONS.ANY) {
		let files = [];
		const normalizedPath = dir.endsWith('/') ? dir : `${dir}/`;
		try {
			const items = readdirSync(normalizedPath, { withFileTypes: true });
			for (const item of items) {
				if (item.isDirectory()) {
					files = files.concat(FileUtils.getFileList(`${normalizedPath}${item.name}`, filePattern));
				} else if (FileUtils.isMatchingFile(item.name, filePattern, position)) {
					files.push(`${normalizedPath}${item.name}`);
				}
			}
		} catch (error) {
			console.error(`Error reading directory ${normalizedPath}: ${error.message}`);
		}
		return files;
	}

	static isMatchingFile(fileName, filePattern, position) {
		switch (position) {
			case FileUtils.POSITIONS.STARTS_WITH:
				return fileName.startsWith(filePattern);
			case FileUtils.POSITIONS.ENDS_WITH:
				return fileName.endsWith(filePattern);
			case FileUtils.POSITIONS.ANY:
			default:
				return fileName.includes(filePattern);
		}
	}

	static isExist(fileName) {
		return existsSync(fileName);
	}

	static createDir(newDir) {
		const dir = newDir.toString().replaceAll('\\', '\\\\');
		mkdirSync(dir, { recursive: true });
	}
}
