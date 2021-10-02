import { Component, ViewContainerRef, ComponentFactoryResolver, ViewChild} from '@angular/core';
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

	constructor (private ws : SocketService, private queueService: QueueService,
				private cfr: ComponentFactoryResolver)
	{
		this.queueService.changeEmitted$.subscribe(val => {
			this.updateQueueScreen(val);
		});
	}
	
  ngOnInit(): void {
	this.count = 1;
	this.ws.connect()
	
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
