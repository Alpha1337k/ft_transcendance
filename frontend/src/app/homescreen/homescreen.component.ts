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
/*   *.   homescreen.component.ts  | Created: 2021-09-30 14:04:18    ._    */
/*  -     Edited on 2021-10-02 23:29:35 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
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
