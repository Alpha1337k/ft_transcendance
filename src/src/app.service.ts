import { Injectable } from '@nestjs/common';

class friend {
	name : string;
	lastSeen : Date;
	img : string;
	id : number; 
	constructor(name : string, lastSeen : Date, img : string, id : number) {
		this.name = name;
		this.lastSeen = lastSeen;
		this.img = img;
		this.id = id;
	}
}

var friendlist = [];

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}
	addFriends() {
		friendlist.push(new friend("sjon", new Date('2021-08-17T14:53:20'), "img/enemy.jpg", 104042));
		friendlist.push(new friend("okkel", new Date('2020-12-17T03:24:00'), "img/me.jpg", 104043));
		friendlist.push(new friend("wokkel", new Date(0), "img/me.jpg", 104045));
		friendlist.push(new friend("chef", new Date(), "img/enemy.jpg", 104046));
	}

	getFriends() {
		let rval : string = '';
		if (friendlist.length == 0)
			this.addFriends();
		for (let index = 0; index < friendlist.length; index++) {
			const f : friend = friendlist[index];

			// create an last seen display of layout 'number scale ago' OR online
			let lastSeenText : string;
			if (f.lastSeen.getTime() == new Date(0).getTime())
				lastSeenText = "Online";
			else
			{
				let size : string;
				// get difference in time in minutes
				let diff : number = (new Date().getTime() - f.lastSeen.getTime()) / 1000 / 60;

				console.log("difference of number", diff);
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

			rval += `<div class="friendbox">
						<div class="playerdetails">
							<img src="${f.img}">
							<div>
								<h5>${f.name}</h5>
								<p>${lastSeenText}</p>
							</div>
						</div>
						<div class="friend-linkbox">
							<button onclick="LoadMainContent('profile.html?${f.id}', '#main-box', 'profile')" class="smallbtn">웃</button>
							<button onclick="LoadMainContent('chat.html?${f.id}', '#openchat-overlay' ,'chat')" class="smallbtn">✉</button>
						</div>
					</div>
			`;
		}
		return rval;
	}
}
