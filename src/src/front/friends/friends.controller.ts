import { Controller, Get } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
	constructor (private readonly friendsService: FriendsService) {}
	
	@Get()
	async GetFriends() {
		return await this.friendsService.createFriendsList();
	}
}