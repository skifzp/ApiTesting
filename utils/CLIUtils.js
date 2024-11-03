import minimist from 'minimist';

export default class CLIUtils {
	static getArgs() {
		return minimist(process.argv.slice(2));
	}

	static getArg(name) {
		const args = CLIUtils.getArgs();
		const lowerCaseName = name.toLowerCase();

		for (const arg in args) {
			if (arg.toLowerCase() === lowerCaseName) {
				const argValue = args[arg];
				if (typeof argValue === 'string') {
					return argValue.toLowerCase();
				}
				return argValue;
			}
		}

		return args[name];
	}
}
