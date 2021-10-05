import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import * as lastSeen from 'src/modules/lastseen';
import { Like } from 'typeorm';

@Injectable()
export class FriendsService {
	constructor(private readonly userService: UserService) {}

	async getFriends(id: number) {
		const friends: UserEntity[] = await this.userService.getFriends(1);

		return friends;
	}

	async addFriend(id: number) {
		const user = await this.userService.getUserById(1); // should be self.id
		try {
			await this.userService.addFriend(user.userid, id);
			console.log('saved user!');
		} catch (err) {
			console.log(err);
		}
	}

	async findUsers(name: string) {
		const users = await this.userService.getAllUsersQuery({name: Like(`%${name}%`)});

		return users;
	}
}
