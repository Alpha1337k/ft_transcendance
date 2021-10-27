import { Controller, Get, Param } from '@nestjs/common';
import { MatchService } from './match.service';
import { UserService } from '../user/user.service';

@Controller('match')
export class MatchController {
	constructor(
		private readonly userService: UserService,
		private matchService: MatchService
	) {}

	@Get()
	async GetOwnHistoryJson() {
		return this.userService.getUserHistory(1);
	}

	@Get('rand')
	async addRandMatch() {
		const allusers = await this.userService.getAllUsers();
		if (allusers.length < 2) return;
		const user1 = allusers[Math.floor(Math.random() * allusers.length)];
		let user2 = user1;
		while (user2 === user1)
			user2 = allusers[Math.floor(Math.random() * allusers.length)];

		const score1 = Math.floor(Math.random() * 7);
		const score2 = 7;
		if (Math.floor(Math.random() * 2) == 0)
			return this.matchService.addMatch(
				user1.userid,
				user2.userid,
				score1,
				score2
			);
		else
			return this.matchService.addMatch(
				user1.userid,
				user2.userid,
				score2,
				score1
			);
	}

	@Get(':id')
	async GetHistoryByIdJson(@Param() params) {
		return this.userService.getUserHistory(params.id as number);
	}
}
