/*  * -*  *- *- *- *- *- *- * * ** -* -* -* - *- *- *-* - ** - *- - * *-   */
/*  *       _                                 _                        +\  */
/*   -     | |_ ___ ___ ___ ___ ___ ___ ___ _| |___ ___ ___ ___       +    */
/*   +     |  _|  _| .'|   |_ -|  _| -_|   | . | -_|   |  _| -_|       /*  */
/*  *      |_| |_| |__,|_|_|___|___|___|_|_|___|___|_|_|___|___|         + */
/*  -       ~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~        *  */
/*  *       Oscar Kruithof   |   okruitho    |   Alpha_1337k           *-  */
/*  -*      Robijn van Houts |   rvan-hou    |   robijnvh             -+   */
/*  * /   Jonas Bennink Bolt |   jbennink    |   JonasDBB            /-    */
/*  /       Tim van Citters  |   tvan-cit    |   Tjobo-Hero           *    */
/*   +      Rene Braaksma    |   rbraaksm    |   rbraaksm              -   */
/*    *.                                                              ._   */
/*   *.   friends.controller.ts    | Created: 2021-10-06 17:48:04    ._    */
/*  -     Edited on 2021-10-06 17:48:04 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import { Controller, Get, Param } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { UserService } from '../user/user.service';

@Controller('friends')
export class FriendsController {
	constructor(
		private readonly friendsService: FriendsService,
		private userService: UserService
	) {}

	@Get()
	async GetFriendsJson() {
		return await this.friendsService.getFriends(1);
	}

	@Get('rand')
	async Randfriends() {
		const allusers = await this.userService.getAllUsers();
		if (allusers.length < 2) return;
		const user1 = allusers[Math.floor(Math.random() * allusers.length)];
		let user2 = user1;
		while (user2 === user1)
			user2 = allusers[Math.floor(Math.random() * allusers.length)];
		return this.friendsService.addFriend(user1.userid, user2.userid);
	}

	@Get('add/:id')
	async AddFriend(@Param() params) {
		return await this.friendsService.addFriend(1, params.id as number);
	}

	@Get('find/:id')
	async GetUsers(@Param() params) {
		return await this.friendsService.findUsers(params.id as string);
	}
}
