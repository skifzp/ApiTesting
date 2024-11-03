import StringUtils from './StringUtils';
import { report } from './reportUtils';

export default class Comparator {
	/**
	 * Converts a value to its string representation.
	 * @param {*} value - The value to convert.
	 * @param {number} indent - The current indentation level.
	 * @returns {Promise<string>} The string representation of the value.
	 */
	static async toString(value, indent = 0) {
		const indentStr = StringUtils.addPrefix('', indent, '\t');

		switch (typeof value) {
			case 'string':
				return `'${value}'`;
			case 'number':
				return isNaN(value) ? 'NaN' : String(value);
			case 'boolean':
				return String(value);
			case 'function':
				if (value.name === '__$$clientFunction$$') {
					return await Comparator.toString(await value, indent);
				} else {
					return 'Function';
				}
			case 'object':
				if (value && '_fn' in value) {
					return await Comparator.toString(await value, indent);
				} else if (Array.isArray(value)) {
					const elements = await Promise.all(value.map(async (element) => Comparator.toString(element, indent + 1)));
					const elementsStr = elements.join(`,\n${indentStr}\t`);
					return `[\n${indentStr}\t${elementsStr}\n${indentStr}]`;
				} else if (value === null) {
					return 'null';
				} else {
					const properties = Object.entries(value);
					const propertiesStr = await Promise.all(
						properties.map(async ([key, val]) => {
							const propValue = await Comparator.toString(val, indent + 1);
							return `${indentStr}\t${key}: ${propValue}`;
						})
					);
					return `{\n${propertiesStr.join(`,\n`)}\n${indentStr}}`;
				}
			case 'undefined':
				return 'undefined';
			default:
				throw new Error(`Unexpected type of '${value}'`);
		}
	}

	/**
	 * Logs the assertion result and related information.
	 * @param {Logger} logger - The logger object for reporting.
	 * @param {boolean|null} isPassed - The result of the assertion (true if passed, false if failed, null if no result).
	 * @param {*} actual - The actual value.
	 * @param {*} expected - The expected value.
	 * @param {string} description - The description of the assertion.
	 * @param {Error|null} error - The error object, if any.
	 * @returns {Promise<string>} The log message.
	 */
	static async log(logger, isPassed, actual, expected, description, error = null) {
		const resultPrefix = isPassed !== null ? `Assertion ${isPassed ? 'passed' : 'failed'}` : 'Assert';
		const resultMessage = `${resultPrefix}: ${description}`;

		report.step(logger, resultMessage);

		const actualStr = await Comparator.toString(actual);
		const expectedStr = await Comparator.toString(expected);

		report.log(logger, `Actual:\n${actualStr}`);
		report.log(logger, `Expected:\n${expectedStr}`);

		if (error) {
			const errMsg = error.message || error.errMsg || 'Unknown error'; // Extract the error message or use a fallback
			report.step(logger, `Error:\n${errMsg}`);
			// Throw error without including the stack trace
			throw new Error(`${resultMessage}\nActual:\n${actualStr}\nExpected:\n${expectedStr}\nError:\n${errMsg}
				\n${await this.getObjectsDeltas(actual, expected)}\n`);
		} else if (!isPassed) {
			throw new Error(`${resultMessage}\nActual:\n${actualStr}\nExpected:\n${expectedStr}`);
		}

		return `${resultMessage}\nActual:\n${actualStr}\nExpected:\n${expectedStr}`;
	}

	static async getObjectsDeltas(obj1, obj2) {
		if (!obj1 || !obj2 || typeof obj1 !== 'object' || typeof obj2 !== 'object') return '';

		const comparisonResult = {};
		let message = '';

		const compare = (obj1, obj2, path = '') => {
			const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

			keys.forEach((key) => {
				const fullPath = path ? `${path}.${key}` : key;

				if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object' && obj1[key] !== null && obj2[key] !== null) {
					compare(obj1[key], obj2[key], fullPath);
				} else if (obj1[key] !== obj2[key]) {
					comparisonResult[fullPath] = {
						value1: obj1[key],
						value2: obj2[key],
					};
				}
			});
		};

		compare(obj1, obj2);

		if (Object.keys(comparisonResult).length === 0) {
			message += 'Objects are deeply equal.';
		} else {
			message += 'Differences found:\n';
			for (const key in comparisonResult) {
				if (comparisonResult.hasOwnProperty(key)) {
					message += `${key}: ${JSON.stringify(comparisonResult[key].value1)} !== ${JSON.stringify(comparisonResult[key].value2)}\n`;
				}
			}
		}

		return message;
	}
}
