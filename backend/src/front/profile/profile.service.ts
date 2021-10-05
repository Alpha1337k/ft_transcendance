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
		delete user.image;

		return user;
	}
}
