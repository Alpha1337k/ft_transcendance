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

	async createHistoryDoms(matches: Match[]): Promise<string> {
		let rval = '';
		if (matches == null || matches.length == 0)
			return '<h3>Nothing to display</h3>';
		for (let index = 0; index < matches.length; index++) {
			const m = await this.matchService.getMatchDetails(matches[index].matchid);
			rval += `
			<div class="past-match">
				<a onclick="LoadMainContent('/profile/${m.players[0].userid}', '#main-box')">${m.players[0].name}</a>
				<p> / </p>
				<a onclick="LoadMainContent('/profile/${m.players[1].userid}', '#main-box')">${m.players[1].name}</a>
				<h5>${m.p1Score} - ${m.p2Score}</h5>
			</div>`;
		}
		return rval;
	}

	async getProfile(id: number): Promise<string> {
		const user: UserEntity = await this.userService.getUserById(id);
		const history = await this.userService.getUserHistory(id);

		//await this.matchService.addMatch(1, 2, 10, 1);


		if (user == undefined) return 'user not found';
		const rval = `
			<div class="userprofile">
				<div class="generaldata">
					<img src="data:image/png;base64, ${user.image}">
					<div>
						<h1>${user.name}</h1>
						<p>${lastSeen.createLastSeen(user)}</p>
					</div>
					<div>
						<button onclick="LoadMainContent('/friends/add/${id}', '#main-box'); LoadMainContent('/profile/${id}', '#main-box')">Add</button>
						<br>
						<br>
						<button>Invite</button>
					</div>
				</div>
				<div class="user-history">
					<h3>Last games</h3>
					<div class="match-history-table">
						${await this.createHistoryDoms(history)}
					</div>
				</div>
				<div class="user-perfomance">
					<h3>Stats</h3>
					<div class="performancediv">
					<div class="performancecard">
						<h5>Wins</h5>
						<p>${user.wins}</p>
					</div>
					<div class="performancecard">
						<h5>Losses</h5>
						<p>${user.losses}</p>
					</div>
					<div class="performancecard">
						<h5>Rating</h5>
						<p>${user.userElo}</p>
					</div>
					<div class="performancecard">
						<h5>Ranking</h5>
						<p>${user.UserRank}</p>
					</div>
				</div>
		</div>		
		`;

		return rval;
	}

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
