import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async all() {
		await this.userService.addUserRandom();
		return (
			'this is it::' + JSON.stringify(await this.userService.getAllUsers())
		);
	}

	@Get(':id')
	async id(@Param() user ) {
		return await this.userService.getUserById(user.id);
	}
}
