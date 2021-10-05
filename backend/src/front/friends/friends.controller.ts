import { Controller, Get, Param } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService) {}

	@Get()
	async GetFriendsJson() {
		return await this.friendsService.getFriends(1);
	}

	@Get('add/:id')
	async AddFriend(@Param() params) {
		return await this.friendsService.addFriend(params.id as number);
	}

	@Get('find/:id')
	async GetUsers(@Param() params) {
		return await this.friendsService.findUsers(params.id as string);
	}
}
