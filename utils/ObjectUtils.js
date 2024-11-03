export default class ObjectUtils {

	static clone(obj) {
		if (obj === undefined || obj === null) return {};
		if (typeof obj !== 'object') throw new Error(`Is not object`);
		return Object.assign({}, obj);
	}

	static removeUndefinedKeys(obj) {
		if (typeof obj !== 'object' || obj == null) return obj;
		if (Array.isArray(obj)) return obj.map((item) => ObjectUtils.removeUndefinedKeys(item));
		if (typeof obj === 'object' && !Object.keys(obj).length) return obj;

		return Object.fromEntries(
			Object.entries(obj)
				.filter(([key, value]) => value !== undefined)
				.map(([key, value]) => [key, ObjectUtils.removeUndefinedKeys(value)])
		);
	}

	static toString(obj, spaces = 2) {
		if (typeof obj === 'object') {
			return JSON.stringify(
				obj,
				function (key, obj) {
					if (obj instanceof RegExp) {
						return obj.toString();
					}
					return obj;
				},
				spaces
			);
		}
		return obj;
	}
}
