import { HttpClient } from '@angular/common/http';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FriendcardComponent } from '../friendcard/friendcard.component';
import { User } from '../modules/interfaces';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

	userid = 1;
	searchtext: string = '';
	@ViewChild('container', { read: ViewContainerRef })
	container!: ViewContainerRef;
	
	constructor(private http: HttpClient, private cfr: ComponentFactoryResolver) { }

	async ngOnInit(): Promise<void> {
		this.loadfriends();
	}

	async loadfriends() {
		let friends: User[] = await this.http.get<User[]>(`http://localhost:5000/friends/`).toPromise();

		console.log(friends);
		this.container.clear();
		const factory = this.cfr.resolveComponentFactory(FriendcardComponent);
		for (let i = 0; i < friends.length; i++) {
			const e = friends[i];
			const ref = this.container.createComponent(factory);
			ref.instance.load(e);
		}
	}

	async runsearch(query: string)
	{
		console.log("searching", query);
		if (query == '')
		{
			this.loadfriends();
			return;
		}
		let finds: User[] = await this.http.get<User[]>(`http://localhost:5000/friends/find/${query}`).toPromise();
		
		this.container.clear();
		const factory = this.cfr.resolveComponentFactory(FriendcardComponent);
		for (let i = 0; i < finds.length; i++) {
			const e = finds[i];
			const ref = this.container.createComponent(factory);
			ref.instance.load(e);
		}
	}

}
