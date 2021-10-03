import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueueService } from '../queue.service';
import { SocketService } from '../socket.service';

interface initdata {
	gameId: number;
	userId: number;
}

@Component({
  selector: 'app-queuescreen',
  templateUrl: './queuescreen.component.html',
  styleUrls: ['./queuescreen.component.css']
})
export class QueuescreenComponent implements OnInit {
	queuecount = 0;
  constructor(private ws: SocketService, private router: Router, private queueService: QueueService) { }
	connection: Subscription | undefined;


  ngOnInit(): void {
	  console.log('hallo');
	  this.connection = this.ws.create_obs("gameFound").subscribe((initdata: initdata) => {
		console.log("update!", initdata);

		this.router.navigate([`/play/pong/${initdata.gameId}/${initdata.userId}`])
	});
  }

  ngOnDestroy(): void {
	  console.log('daag');
	  this.ws.sendMessage("leaveQueue", '');

  }

  initCalls(type: string): void {
	this.ws.sendMessage("findGame", '');
  }

  killqueue() {
	this.queueService.conna?.destroy();
  }

}
