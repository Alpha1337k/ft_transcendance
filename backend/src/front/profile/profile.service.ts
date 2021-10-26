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
/*   *.   profile.service.ts       | Created: 2021-10-06 17:48:04    ._    */
/*  -     Edited on 2021-10-06 17:48:04 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { Match } from '../../match/match.entity';
import { UserService } from 'src/user/user.service';
import * as lastSeen from 'src/modules/lastseen';
import { MatchService } from '../../match/match.service';

@Injectable()
export class ProfileService {
	constructor(
		private readonly userService: UserService,
		private readonly matchService: MatchService
	) {}

	async getProfileJson(id: number): Promise<Object>
	{
		const user: UserEntity = await this.userService.getUserById(id);
		const history = await this.userService.getUserHistory(id);

		user.history = history;
		delete user.twoFactorSecret;
		delete user.friends;

		return user;
	}
}
