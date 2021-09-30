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
