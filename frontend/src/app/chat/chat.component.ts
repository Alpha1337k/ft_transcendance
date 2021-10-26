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
/*   *.   chat.component.ts        | Created: 2021-10-06 17:48:04    ._    */
/*  -     Edited on 2021-10-06 17:48:04 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { SocketService } from '../socket.service';

interface IncomingChatMessage {
	sendDate: Date;
	id: number;
	message: string;
	sender: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
	chatid: number = -1;
	userid:	number = 1;

	name:	string = '';
	heightVal: string = '30vh';
	topVal:string		= '0';
	chatValue: string = '';
	messages: string = '';


  constructor(private cs: ChatService, private ws: SocketService,
				private http: HttpClient) { }

  async ngOnInit(): Promise<void> {
	  this.ws.create_obs("msgToClients").subscribe(msg => {
		  this.messages += msg;
	  })
	  this.name = 'Jeff';
	  const msg = await this.http.get<IncomingChatMessage[]>(`http://localhost:5000/chat/messages/${this.chatid}`).toPromise();
	  for (let i = 0; i < msg.length; i++) {
		  const e = msg[i];
		  this.messages += `<div class="chatmessagebox">
		  					<h5>${e.sender}</h5>
							  <p>${e.message}</p>
							</div>
							`
	  }
  }

  init(chatid: number, userid: number) {
	this.chatid = chatid;
	this.userid = userid;
  }
  minimizewindow() {
		if (this.heightVal === '30vh')
		{
			this.heightVal = '4vh';
			this.topVal = '26vh';
		}
		else
		{
			this.heightVal = '30vh';
			this.topVal = '0vh';
		}
	}

	messagesend() {
		this.ws.sendMessage("sendChatMessage", {userid: this.userid, chatid: this.chatid, message: this.chatValue});
	}

  killwindow() {
	  const idx = this.cs.openChats.findIndex(x => x.instance.chatid === this.chatid);

	  this.cs.openChats[idx].destroy();
	  this.cs.openChats.splice(idx);
  }
}
