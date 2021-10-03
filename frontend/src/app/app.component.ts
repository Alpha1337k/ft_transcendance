import { HttpClient } from '@angular/common/http';
import { Component, ViewContainerRef, ComponentFactoryResolver, ViewChild} from '@angular/core';
import { ChatService } from './chat.service';
import { ChatComponent } from './chat/chat.component';
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
	openChat(chatid: number) {
		console.log("wow a chat", chatid);
		const factory = this.cfr.resolveComponentFactory(ChatComponent);
		const ret = this.chatcontainer.createComponent(factory);
		this.cs.openChats.push(ret);
		ret.instance.init(chatid, 1);
		
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
