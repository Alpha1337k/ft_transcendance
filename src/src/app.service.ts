import { Injectable } from '@nestjs/common';
import * as avatarCreator from './modules/generateAvatar/generateAvatar';
import { join } from 'path';

class concluded_match {
	p1 : friend;
	p2 : friend;
	p1Score: number;
	p2Score: number;
	constructor(p1: friend, p2:friend, p1Score:number, p2Score: number) {
		this.p1 = p1;
		this.p2 = p2;
		this.p1Score = p1Score;
		this.p2Score = p2Score;
	}
}

class friend {
	name : string;
	lastSeen : Date;
	img : string;
	id : number;
	wins : number;
	losses : number;
	goals : number;
	ranking : string;
	history : concluded_match [];

	createHistory() : concluded_match[]
	{
		let matches = [];
		let len = Math.round(Math.random() * 20);
		if (len >= 10)
			len = 0;
		for (let i = 0; i < len; i++) {
			let match = new concluded_match(this, this, Math.round(Math.random() * 10), Math.round(Math.random() * 10));
			matches.push(match);
		}
		return matches;
	}

	constructor(name : string, lastSeen : Date, id : number) {
		this.name = name;
		this.lastSeen = lastSeen;
		this.img = 'img/' + id + '.jpg';

		// temporary image placement
		avatarCreator.generateAvatar(join(__dirname, '..', 'site_static/img/' + id + '.jpg'));
		this.id = id;
		this.history = this.createHistory();
		this.wins = Math.round(Math.random() * 500);
		this.losses = Math.round(Math.random() * 500);
		this.goals = Math.round(Math.random() * 1000);
		this.ranking = 'S+';
	}
}

var friendlist = [];

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}
	addFriends() {
		friendlist.push(new friend("sjon", new Date('2021-08-17T14:53:20'), 104042));
		friendlist.push(new friend("okkel", new Date('2020-12-17T03:24:00'),104043));
		friendlist.push(new friend("wokkel", new Date(0), 104045));
		friendlist.push(new friend("chef", new Date(), 104046));
	}

	getFriends() {
		let rval : string = '';
		if (friendlist.length == 0)
			this.addFriends();
		for (let index = 0; index < friendlist.length; index++) {
			const f : friend = friendlist[index];

			const lastSeenText : string = this.createLastSeen(f);

			rval += `<div class="friendbox">
						<div class="playerdetails">
							<img src="${f.img}">
							<div>
								<h5>${f.name}</h5>
								<p>${lastSeenText}</p>
							</div>
						</div>
						<div class="friend-linkbox">
							<button onclick="LoadMainContent('profile?id=${f.id}', '#main-box', 'profile')" class="smallbtn">웃</button>
							<button onclick="LoadMainContent('chat.html?id=${f.id}', '#openchat-overlay' ,'chat')" class="smallbtn">✉</button>
						</div>
					</div>
			`;
		}
		return rval;
	}

	// create an last seen display of layout 'number scale ago' OR online
	createLastSeen(user : friend): string {
		let lastSeenText : string;

		if (user.lastSeen.getTime() == new Date(0).getTime())
			lastSeenText = "Online";
		else
		{
			let size : string;
			// get difference in time in minutes
			let diff : number = (new Date().getTime() - user.lastSeen.getTime()) / 1000 / 60;

			// scale accordingly
			if (diff >= 60 && diff < 1440)
			{
				diff /= 60;
				size = ' hours';
			}
			else if (diff >= 1440)
			{
				diff /= 1440;
				size = ' days';					
			}
			else
				size = ' minutes';
			lastSeenText = Math.round(diff) + size + " ago";
		}
		return lastSeenText;
	}

	findUser(userId : number) : friend
	{
		let i : number = 0;
		for (; i <= friendlist.length; i++) {
			if (i == friendlist.length)
				return (undefined);
			if (friendlist[i].id == userId)
				break;
		}
		return friendlist[i];
	}

	createHistoryDoms(matches : concluded_match[]): string
	{
		let rval : string = '';
		if (matches.length == 0)
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

	getProfile(userId) {
		if (friendlist.length == 0)
			this.addFriends();

		const f = this.findUser(userId);
			if (f == undefined)
		return("not found");
		console.log("userId:", userId, f.id);
		let rval : string = `
			<div class="userprofile">
				<div class="generaldata">
					<img src="${f.img}">
					<div>
						<h1>${f.name}</h1>
						<p>${this.createLastSeen(f)}</p>
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
						${this.createHistoryDoms(f.history)}
					</div>
				</div>
				<div class="user-perfomance">
					<h3>Stats</h3>
					<div>
						<h5>Wins</h5>
						<p>${f.wins}</p>
					</div>
					<div>
						<h5>Losses</h5>
						<p>${f.losses}</p>
					</div>
					<div>
						<h5>Goals</h5>
						<p>${f.goals}</p>
					</div>
					<div>
						<h5>Abandons</h5>
						<p>0</p>
					</div>
					<div>
						<h5>Ranking</h5>
						<p>${f.ranking}</p>
					</div>
				</div>
		</div>		
		`;

		return rval;
	}
}
