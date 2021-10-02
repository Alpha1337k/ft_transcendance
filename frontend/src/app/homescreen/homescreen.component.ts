import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { QueueService } from '../queue.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-homescreen',
  templateUrl: './homescreen.component.html',
  styleUrls: ['./homescreen.component.css']
})
export class HomescreenComponent implements OnInit {
	constructor(private ws: SocketService, private queueService: QueueService) { }
	public queuecount: number = 1;
	connection: Subscription | undefined;
	@Output() queueEvent = new EventEmitter<string>();

  ngOnInit(): void {
	//this.ws.set_on("QueueUpdate", this.updateQueue);
	this.connection = this.ws.create_obs("QueueUpdate").subscribe((count) => {
		console.log("update!", count);
		this.queuecount = count as number;
	});
	
  }

  ngOnDestroy(): void {
	this.connection?.unsubscribe();
  }

  queueCall(type: string) {
	  this.queueService.emitChange(type);
  }


}
