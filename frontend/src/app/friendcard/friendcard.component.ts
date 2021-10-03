import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { User } from '../modules/interfaces';

@Component({
  selector: 'app-friendcard',
  templateUrl: './friendcard.component.html',
  styleUrls: ['./friendcard.component.css']
})
export class FriendcardComponent implements OnInit {
	user: User | undefined;
  constructor(private cs: ChatService) { }

  ngOnInit(): void {
  }

	public load(user: User)
	{
		this.user = user;
	}

	openchat() {
		this.cs.emitChange(this.user?.userid);
	}

}
