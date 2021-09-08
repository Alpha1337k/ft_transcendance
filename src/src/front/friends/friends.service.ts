import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import * as lastSeen from 'src/modules/lastseen';

@Injectable()
export class FriendsService {
	constructor (private readonly userService : UserService) {}

	async createFriendsList() {
		let rval : string = ``;
		let friends : UserEntity[] = await this.userService.getAllUsers();

		for (let index = 0; index < friends.length; index++) {
			const f : UserEntity = friends[index];

			const lastSeenText : string = lastSeen.createLastSeen(f);

			rval += `<div class="friendbox">
						<div class="playerdetails">
							<img src="data:image/png;base64, ${f.image}">
							<div>
								<h5>${f.name}</h5>
								<p>${lastSeenText}</p>
							</div>
						</div>
						<div class="friend-linkbox">
							<button onclick="LoadMainContent('profile/${f.userid}', '#main-box', 'profile')" class="smallbtn">웃</button>
							<button onclick="LoadMainContent('chat/${f.userid}', '#openchat-overlay')" class="smallbtn">✉</button>
						</div>
					</div>
			`;
		}
		return rval;
	}

	async addFriend(id : number) {
		const user = await this.userService.getUserById(1);
		const toadd = await this.userService.getUserById(2);

		user.addFriend(toadd);

		this.userService.updateUser(user);

		console.log("saved user!");

		return "Added user!";
	}
}
