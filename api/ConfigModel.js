class HttpsAgentModel {
	constructor(a) {
		this.defaultPort = a.defaultPort;
		this.protocol = a.protocol;
		this.keepAliveMsecs = a.keepAliveMsecs;
		this.keepAlive = a.keepAlive;
		this.maxSockets = a.maxSockets;
		this.maxFreeSockets = a.maxFreeSockets;
		this.maxTotalSockets = a.maxTotalSockets;
		this.totalSocketCount = a.totalSocketCount;
		this.maxCachedSessions = a.maxCachedSessions;
	}
}

export class ConfigModelForNonExpectedStatus {
	constructor(config) {
		this.timeout = config.timeout;
		this.validateStatus = config.validateStatus;
		this.headers = config.headers;
		this.baseURL = config.baseURL;
		this.httpsAgent = new HttpsAgentModel(config.httpsAgent);
		this.params = config.params;
		this.method = config.method;
		this.url = config.url;
		this.data = config.data;
	}
}

export class ConfigModelForExpectedStatus {
	constructor(config) {
		this.url = config.baseURL + config.url;
		this.method = config.method;
		this.data = config.data;
		this.params = config.params;
		this.headers = config.headers;
	}
}
