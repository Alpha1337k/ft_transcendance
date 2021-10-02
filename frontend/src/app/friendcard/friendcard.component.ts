import { Component, OnInit } from '@angular/core';
import { User } from '../modules/interfaces';

@Component({
  selector: 'app-friendcard',
  templateUrl: './friendcard.component.html',
  styleUrls: ['./friendcard.component.css']
})
export class FriendcardComponent implements OnInit {
	user: User | undefined;
  constructor() { }

  ngOnInit(): void {
  }

	public load(user: User)
	{
		this.user = user;
	}

}
