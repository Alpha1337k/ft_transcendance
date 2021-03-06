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
/*   *.   friends.service.ts       | Created: 2021-10-27 21:48:57    ._    */
/*  -     Edited on 2021-10-27 21:48:57 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Like } from 'typeorm';

@Injectable()
export class FriendsService {
	constructor(private readonly userService: UserService) {}

	async getFriends(id: number) {
		return await this.userService.getFriends(1);
	}

	async addFriend(id1: number, id2: number) {
		const user = await this.userService.getUserById(id1); // should be self.id
		try {
			await this.userService.addFriend(user.userid, id2);
			console.log('saved user!');
		} catch (err) {
			console.log(err);
		}
	}

	async findUsers(name: string) {
		return await this.userService.getAllUsersQuery({
			name: Like(`%${name}%`),
		});
	}
}
