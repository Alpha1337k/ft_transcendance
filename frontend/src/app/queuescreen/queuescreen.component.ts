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
/*   *.   queuescreen.component.ts | Created: 2021-10-06 17:48:04    ._    */
/*  -     Edited on 2021-10-06 17:48:04 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
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
