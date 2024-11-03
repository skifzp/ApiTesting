import RandomGenerator from '../utils/RandomGenerator';

export const enumUtils = {
	getValues: (obj, excludes = [], prop = 'value') => {
		return enumUtils.getObjects(obj, excludes, prop).map((item) => item[prop]);
	},

	isValueExist: (obj, val, prop = 'value') => {
		return (
			Object.values(obj).filter((item) => {
				if (item[prop]) {
					return item[prop].toLowerCase() === val.toLowerCase();
				}
				return false;
			}).length > 0
		);
	},

	getValuesByPartOfValue: (obj, txt, prop = 'value') => {
		return Object.values(obj)
			.filter((item) => {
				if (item[prop]) {
					return item[prop].includes(txt);
				}
				return false;
			})
			.map((item) => item[prop]);
	},

	getByKeyNameAndKeyValue: (obj, keyName, keyValue, isCaseSensitive = true) => {
		if (!isCaseSensitive) {
			return Object.values(obj).filter((item) => {
				if (typeof item[keyName] === 'string' && typeof keyValue === 'string') {
					return item[keyName].toLowerCase() === keyValue.toLowerCase();
				} else {
					return item[keyName] === keyValue;
				}
			});
		}
		return Object.values(obj).filter((item) => item[keyName] === keyValue);
	},

	/**
	 * @param obj is enum class
	 * @param keyName is key name of enum class
	 * @param excludes is waht we don't want to return
	 * @returns arbitrary object in which keyName value doesn't match one of excludes
	 */
	getRandom: (obj, excludes = [], keyName) => {
		let a = Object.values(obj).filter((item) => !excludes.includes(item[keyName]));
		if (!a.length) {
			throw new Error(`Impossible get any arbitrary value of ${obj.constructor} which excludes ${excludes} and key-name is ${keyName}`);
		}
		let position = RandomGenerator.getRandomIndexOfArray(a.length);
		return a[position];
	},

	getObjects: (obj, excludes = [], prop = 'value') => {
		return Object.values(obj).filter((item) => !excludes.includes(item[prop]) && item[prop]);
	},
};
