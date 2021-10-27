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
/*   *.   match.service.ts         | Created: 2021-10-06 17:48:04    ._    */
/*  -     Edited on 2021-10-06 17:48:04 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class MatchService {
	constructor(
		@Inject('MATCH_REPOSITORY')
		private matchRepo: Repository<Match>,
		private userService: UserService
	) {}

	async addMatch(
		idP1: number,
		idP2: number,
		p1Score: number,
		p2Score: number
	): Promise<Match> {
		const p1 = await this.userService.getUserById(idP1);
		const p2 = await this.userService.getUserById(idP2);

		const newMatch = this.matchRepo.create({
			p1Score: p1Score,
			p2Score: p2Score,
		});
		if (p1Score > p2Score) {
			await this.userService.updateElo(p1.userid, true, p2.userElo);
			await this.userService.updateElo(p2.userid, false, p1.userElo);
		} else {
			await this.userService.updateElo(p1.userid, false, p2.userElo);
			await this.userService.updateElo(p2.userid, true, p1.userElo);
		}
		newMatch.players = [p1, p2];
		return this.matchRepo.save(newMatch);
	}

	async getMatchDetails(matchId: number): Promise<Match> {
		return this.matchRepo.findOne(matchId, {
			relations: ['players'],
		});
	}
}
