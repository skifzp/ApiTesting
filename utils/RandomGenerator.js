export default class RandomGenerator {
	static LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
	static UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	static NUMBERS = '0123456789';
	static SPECIAL_CHARS = "!#$%&'()*+,-./:;<=>?@[]^_`{|}~";

	/**
	 * return arbitrary integer between  @param min and  @param max
	 * in case  @param isInclusive is false => The maximum is exclusive and the minimum is exclusive
	 * in case  @param isInclusive is true => The maximum is inclusive and the minimum is inclusive
	 */
	static getRandomInt(min, max, isInclusive = true, exclude = []) {
		let minimum = Math.ceil(min);
		let maximum = Math.floor(max);

		if (minimum === maximum && !isInclusive) {
			throw new Error(`Impossible find random int between '${min}' and '${max}' are not including them`);
		}

		if (!isInclusive) {
			minimum++;
			maximum--;
		}

		if (minimum > maximum) {
			throw new Error(`Impossible find random int between '${min}' and '${max}' are ${isInclusive ? '' : 'not'} including them`);
		}

		let count = 0;
		let res = null;
		do {
			res = Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
			count++;
			if (exclude.includes(res)) res = null;
		} while (res === null && count < 10);
		if (res === null) {
			throw new Error(`Impossible find random int between '${min}' and '${max}' are ${isInclusive ? '' : 'not'} including them and exclude '${exclude}'`);
		}
		return res;
	}

	static getRandomText(length = 7) {
		const symbols = `${RandomGenerator.NUMBERS}${RandomGenerator.UPPERCASE_CHARS}${RandomGenerator.LOWERCASE_CHARS}`;
		let res = '';
		for (let i = 0; i < length; i++) {
			const position = RandomGenerator.getRandomInt(0, symbols.length - 1);
			res += symbols.slice(position, position + 1);
		}
		return res;
	}
}
