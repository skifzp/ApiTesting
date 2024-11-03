import { SELECTED_ENV } from '../config';
import BaseClass from './services/BaseClass';
import Cloud from './services/Cloud';
import Device from './services/Device';

export class Api extends BaseClass{
	constructor(config = SELECTED_ENV) {
		super(config);
		this.device = new Device(config);
		this.cloud = new Cloud(config);
	}

	setInstances(instance) {
		this.device.setInstances(instance);
		this.cloud.setInstances(instance);
	}
}
