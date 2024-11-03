import CLIUtils from './utils/CLIUtils';

export const ENV = 'Env';
export const DEVICE_IP_KEY = 'deviceIp';
export const CLOUD_URL_KEY = 'cloudIp';

const DEFAULT_ENV = 'cmos';

const DEFAULT_CLOUD_URL = `https://automation.ienso.com`;
const env = CLIUtils.getArg('env')|| DEFAULT_ENV;

export const environments = (envId) => {
	const envs = {
		cmos: {
			[ENV]: 'cmos',
			[DEVICE_IP_KEY]: `192.168.0.2`,
			[CLOUD_URL_KEY]: DEFAULT_CLOUD_URL,
		},
		ccd: {
			[ENV]: 'ccd',
			[DEVICE_IP_KEY]: `192.168.0.11`,
			[CLOUD_URL_KEY]: DEFAULT_CLOUD_URL,
		},
	};
	return envs[envId];
};

export const SELECTED_ENV = environments(env.toLowerCase());
