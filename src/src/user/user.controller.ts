import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';


@Controller("users")
export class UserController {
	constructor (private readonly userService: UserService) {}

	@Get()
	async all() {
		this.userService.addUserRandom();
		return "this is it::" + await this.userService.getAllUsers();
	}
}