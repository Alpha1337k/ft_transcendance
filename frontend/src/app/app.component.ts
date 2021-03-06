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
/*   *.   app.component.ts         | Created:     ._    */
/*  -     Edited on  by alpha_1337                 .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import { HttpClient } from '@angular/common/http';
import { Component, ViewContainerRef, ComponentFactoryResolver, ViewChild} from '@angular/core';
import { ChatService } from './chat.service';
import { ChatComponent } from './chat/chat.component';
import { User } from './modules/interfaces';
import { QueueService } from './queue.service';
import { QueuescreenComponent } from './queuescreen/queuescreen.component';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pong';
  count = 0;
  userid = 1;

	@ViewChild('queuecontainer', { read: ViewContainerRef })
	container!: ViewContainerRef;

	@ViewChild('chatcontainer', { read: ViewContainerRef })
	chatcontainer!: ViewContainerRef;

	constructor (private ws : SocketService, private queueService: QueueService,
				private cfr: ComponentFactoryResolver, private cs: ChatService)
	{
		this.queueService.changeEmitted$.subscribe(val => {
			this.updateQueueScreen(val);
		});

		this.cs.changeEmitted$.subscribe(val => {
			this.openChat(val);
		})
	}
	
	ngOnInit(): void {
	this.count = 1;
	this.ws.connect()

	}
	openChat(chatUser: User) {
		console.log("wow a chat", chatUser.userid);
		const factory = this.cfr.resolveComponentFactory(ChatComponent);
		const ret = this.chatcontainer.createComponent(factory);
		this.cs.openChats.push(ret);
		ret.instance.init(chatUser);
		
	}

	updateQueueScreen(type: string)
	{
		console.log("wow a queue", type);
		const factory = this.cfr.resolveComponentFactory(QueuescreenComponent);

		this.container.remove();
		const ret = this.container.createComponent(factory);
		this.queueService.conna = ret;
		ret.instance.initCalls(type);
	}
}
