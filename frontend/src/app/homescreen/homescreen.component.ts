import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-homescreen',
  templateUrl: './homescreen.component.html',
  styleUrls: ['./homescreen.component.css']
})
export class HomescreenComponent implements OnInit {
	constructor(private ws: SocketService) { }
	public queuecount: number = 1;
	connection: Subscription | undefined;


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


}
