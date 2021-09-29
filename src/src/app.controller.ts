import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	returnMain(): string {
		return this.appService.getMain();
	}

	@Get('struct')
	async returnStructure() {
		return await this.appService.getStructure();
	}
}
