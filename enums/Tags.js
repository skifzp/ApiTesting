import StringUtils from '../utils/StringUtils';

export const PREFIX = '<';
export const ENDING = '>';
export const TAGS_ARGUMENT = 'tags';

export default class Tags {
	static DEVICE = new Tags({ tag: `device` });
	static CLOUD = new Tags({ tag: `cloud` });
	static SECURITY = new Tags({ tag: `security` });

	constructor({ tag }) {
		this.tag = `${PREFIX}${tag}${ENDING}`;
	}

	static getPartOfName(tags = []) {
		let result = '';
		if (Array.isArray(tags)) tags.map((tag) => (result = result + (result ? '-' : '') + StringUtils.removeNonAlphaCharacters(tag)));
		return result ? `-${result}` : result;
	}
}
