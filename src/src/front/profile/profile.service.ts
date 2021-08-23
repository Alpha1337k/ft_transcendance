import { Injectable } from '@nestjs/common';
import { concludedMatch, UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import * as lastSeen from 'src/modules/lastseen';

@Injectable()
export class ProfileService {
	constructor (private readonly userService : UserService) {}

	createHistoryDoms(matches : concludedMatch[]): string
	{
		let rval : string = '';
		if (matches == null || matches.length == 0)
			return ("<h3>Nothing to display</h3>")
		for (let index = 0; index < matches.length; index++) {
			const m = matches[index];
			rval += `
			<div class="past-match">
				<a>${m.p1.name}</a> <p> / </p><a>${m.p2.name}</a><h5>${m.p1Score} - ${m.p2Score}</h5>
			</div>`
		}
		return rval;
	}
	
	async getProfile(id : number) : Promise<string> {
		let user : UserEntity = await this.userService.getUserById(id);
	
		if (user == undefined)
			return 'user not found';
		let rval : string = `
			<div class="userprofile">
				<div class="generaldata">
					<img src="data:image/png;base64, ${user.image}">
					<div>
						<h1>${user.name}</h1>
						<p>${lastSeen.createLastSeen(user)}</p>
					</div>
					<div>
						<button>Add</button>
						<br>
						<br>
						<button>Invite</button>
					</div>
				</div>
				<div class="user-history">
					<h3>Last games</h3>
					<div class="match-history-table">
						${this.createHistoryDoms(user.history)}
					</div>
				</div>
				<div class="user-perfomance">
					<h3>Stats</h3>
					<div>
						<h5>Wins</h5>
						<p>${user.wins}</p>
					</div>
					<div>
						<h5>Losses</h5>
						<p>${user.losses}</p>
					</div>
					<div>
						<h5>Abandons</h5>
						<p>0</p>
					</div>
					<div>
						<h5>Ranking</h5>
						<p>${user.UserRank}</p>
					</div>
				</div>
		</div>		
		`;
		
		return rval;
	}
}
