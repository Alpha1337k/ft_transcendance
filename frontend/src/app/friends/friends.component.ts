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
	@ViewChild('container', { read: ViewContainerRef })
	container!: ViewContainerRef;
  constructor(private http: HttpClient, private cfr: ComponentFactoryResolver) { }

	async ngOnInit(): Promise<void> {
		let friends: User[] = await this.http.get<User[]>(`http://localhost:5000/friends/json`).toPromise();

		console.log(friends);
		const factory = this.cfr.resolveComponentFactory(FriendcardComponent);
		for (let i = 0; i < friends.length; i++) {
			const e = friends[i];
			const ref = this.container.createComponent(factory);
			ref.instance.load(e);
		}
	}

}
