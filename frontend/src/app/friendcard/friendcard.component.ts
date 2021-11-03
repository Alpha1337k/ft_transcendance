/*  * -*  *- *- *- *- *- *- * * ** -* -* -* - *- *- *-* - ** - *- - * *-   */
/*  *       _                                 _                        +\  */
/*   -     | |_ ___ ___ ___ ___ ___ ___ ___ _| |___ ___ ___ ___       +    */
/*   +     |  _|  _| .'|   |_ -|  _| -_|   | . | -_|   |  _| -_|       /*  */
/*  *      |_| |_| |__,|_|_|___|___|___|_|_|___|___|_|_|___|___|         + */
/*  -       ~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~        *  */
/*  *       Oscar Kruithof   |   okruitho    |   Alpha_1337k           *-  */
/*  -*      Robijn van Houts |   rvan-hou    |   robijnvh             -+   */
/*  * /   Jonas Bennink Bolt |   jbennink    |   JonasDBB            /-    */
/*  /       Tim van Citters  |   tvan-cit    |   Tjobo-Hero           *    */
/*   +      Rene Braaksma    |   rbraaksm    |   rbraaksm              -   */
/*    *.                                                              ._   */
/*   *.   friendcard.component.ts  | Created:     ._    */
/*  -     Edited on  by alpha_1337                 .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
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
		if (this.user)
			this.cs.emitChange(this.user);
	}

}
