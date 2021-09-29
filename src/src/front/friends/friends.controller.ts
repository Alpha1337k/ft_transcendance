import { Controller, Get, Param } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService) {}

	@Get()
	async GetFriends() {
		return await this.friendsService.createFriendsList();
	}

	@Get('add/:id')
	async AddFriend(@Param() params) {
		return await this.friendsService.addFriend(params.id as number);
	}
}
