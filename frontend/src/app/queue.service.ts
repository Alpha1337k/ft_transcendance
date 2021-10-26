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
/*   *.   queue.service.ts         | Created: 2021-10-02 23:25:34    ._    */
/*  -     Edited on 2021-10-03 00:06:38 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import { ComponentRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { QueuescreenComponent } from './queuescreen/queuescreen.component';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
	private queueChangeSource = new Subject<any>();
	public	conna: ComponentRef<QueuescreenComponent> | undefined;
  constructor() { }
  changeEmitted$ = this.queueChangeSource.asObservable();

  emitChange(change: any) {
	this.queueChangeSource.next(change);
}
}
