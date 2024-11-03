import RandomGenerator from '../utils/RandomGenerator';

export default class Users {
	static ADMIN = new Users({
		username: 'username',
		password: 'password',
		name: 'Admin',
	});

	constructor({ username, password, name }) {
		this.username = username;
		this.password = password;
		this.name = name;
	}

	static getUsers() {
		return Object.values(Users);
	}

	/**
	 * @param excludes is an array of users we want to exclude
	 * @param keyName is the key with which we exclude users
	 * @returns random user
	 **/
	static getRandom(excludes = [], keyName = 'username') {
		const users = Users.getUsers().filter((u) => !excludes.includes(u[keyName]));
		const position = RandomGenerator.getRandomIndexOfArray(users.length);
		return users[position];
	}
}
