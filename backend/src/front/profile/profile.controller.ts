import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get(':id')
	async returnProfile(@Param() param): Promise<string> {
		// console.log(param.id);
		return await this.profileService.getProfile(param.id as number);
	}

	@Get('get/:id')
	async returnJsonProfile(@Param() param): Promise<Object> {
		// console.log(param.id);
		return await this.profileService.getProfileJson(param.id as number);
	}
}