import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async all() {
		return this.userService.getAllUsers();
	}

	@Get('rand')
	async addRandom() {
		return this.userService.addUserRandom();
	}

	@Get(':id')
	async id(@Param() user) {
		return this.userService.getUserById(user.id);
	}
}
