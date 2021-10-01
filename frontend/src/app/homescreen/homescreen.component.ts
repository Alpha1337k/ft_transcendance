import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-homescreen',
  templateUrl: './homescreen.component.html',
  styleUrls: ['./homescreen.component.css']
})
export class HomescreenComponent implements OnInit {
	queuecount = 0;
  constructor(private ws: SocketService) { }

  updateQueue(data: number) {
	  this.queuecount = data;
  }

  ngOnInit(): void {
	this.ws.set_on("QueueUpdate", this.updateQueue);
  }


}
