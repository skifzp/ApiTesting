import Comparator from './Comparator';
import * as chai from 'chai';
import chaiExclude from 'chai-exclude';
import { report } from './reportUtils';

const { expect } = chai;
chai.use(chaiExclude);

export default class ComparatorChai extends Comparator {
	static async eql(logger, actual, expected, description = '', exclude) {
		try {
			if (exclude) {
				report.step(logger, `Performing assertion of type eql with exclusions of: ${exclude} fields`);
				expect(actual).excluding(exclude).to.be.eql(expected);
			} else {
				expect(actual).to.be.eql(expected, description);
			}
			await Comparator.log(logger, true, actual, expected, description);
		} catch (e) {
			await Comparator.log(logger, false, actual, expected, description, e);
		}
	}

	static async include(logger, actual, expected, description = '') {
		try {
			expect(actual).to.include(expected, description);
			await Comparator.log(logger, true, actual, expected, description);
		} catch (e) {
			await Comparator.log(logger, false, actual, expected, description);
			throw new Error(e);
		}
	}

	static async lt(logger, actual, expected, description = '') {
		try {
			expect(actual).to.be.lessThan(expected, description);
			await Comparator.log(logger, true, actual, expected, description);
		} catch (e) {
			await Comparator.log(logger, false, actual, expected, description);
			throw new Error(e);
		}
	}

	static async lte(logger, actual, expected, description = '') {
		try {
			expect(actual).to.be.lte(expected, description);
			await Comparator.log(logger, true, actual, expected, description);
		} catch (e) {
			await Comparator.log(logger, false, actual, expected, description);
			throw new Error(e);
		}
	}

	static async gte(logger, actual, expected, description = '') {
		try {
			expect(actual).to.be.gte(expected, description);
			await Comparator.log(logger, true, actual, expected, description);
		} catch (e) {
			await Comparator.log(logger, false, actual, expected, description);
			throw new Error(e);
		}
	}

	static async gt(logger, actual, expected, description = '') {
		try {
			expect(actual).to.be.gt(expected, description);
			await Comparator.log(logger, true, actual, expected, description);
		} catch (e) {
			await Comparator.log(logger, false, actual, expected, description);
			throw new Error(e);
		}
	}

	static async oneOf(logger, actual, expectedArray, description = '') {
		try {
			expect(actual).to.oneOf(expectedArray, description);
			await Comparator.log(logger, true, actual, expectedArray, description);
		} catch (e) {
			await Comparator.log(logger, false, actual, expectedArray, description);
			throw new Error(e);
		}
	}
}
