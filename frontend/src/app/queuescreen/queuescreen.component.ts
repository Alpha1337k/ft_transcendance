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
	type: string = '';

  constructor(private ws: SocketService, private router: Router, private queueService: QueueService) { }
	connection: Subscription | undefined;


  ngOnInit(): void {
	  console.log('hallo');
	  this.connection = this.ws.create_obs("gameFound").subscribe((initdata: initdata) => {
		console.log("update!", initdata);

		this.router.navigate([`/play/pong/${initdata.gameId}/${initdata.userId}`])
		this.killqueue();
	
	});
	console.log('hallo');
	this.connection = this.ws.create_obs("chessGameFound").subscribe((initdata: initdata) => {
		console.log("update!", initdata);

		this.router.navigate([`/play/chess/${initdata.gameId}/${initdata.userId}`])
		this.killqueue();
	});
  }

  ngOnDestroy(): void {
	  console.log('daag');
	  if (this.type === "pong")
		this.ws.sendMessage("leaveQueue", '');
		else if (this.type === "chess")
			this.ws.sendMessage("leaveChessQueue", '');
	}

  initCalls(type: string): void {
	this.type = type;
	if (type === "pong")
		this.ws.sendMessage("findGame", '');
	else if (type === "chess")
		this.ws.sendMessage("findChessGame", '');
	}

  killqueue() {
	this.queueService.conna?.destroy();
  }

}
