export default class StringUtils {

	/**
	 * @param pattern is a prefix string
	 * @param number is how much time to add the @param pattern
	 * @param s is source string in which we want to add pattern as a prefix
	 * @returns adding 'pattern'-string to the beginning of a source string
	 **/
	static addPrefix(s, number = 2, pattern = '0') {
		return (s + '').padStart(number, pattern);
	}


	/**
	 * Return string with only alpha characters,
	 * plus remove double and more spaces
	 * and trims spaces at the beginning and end of the string
	 *
	 * For example:
	 * ' <adT> & ^      92er_ #4e & 8a' -> 'adT er e a'
	 */
	static removeNonAlphaCharacters(string) {
		return string
			.toString()
			.replace(/[^a-z ]/gi, '')
			.replace(/\s{2,}/g, ' ')
			.trim();
	}
}
