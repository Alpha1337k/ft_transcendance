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
/*   *.   socket.service.ts        | Created: 2021-09-30 14:27:46    ._    */
/*  -     Edited on 2021-10-03 01:27:42 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

	constructor(private socket: Socket) {}

	sendMessage(name:string, msg: any) {
		this.socket.emit(name, msg);
	}

	connect() {
		if (this.socket.connect())
		{
			console.log("connected!!");
		}
	}

	set_on(name: string, func: any)
	{
		this.socket.on(name, func);
	}

	create_obs(name: string)
	{
		let observable = new Observable<any>(observer => {
			this.socket.on(name, (data : any) => {
			  observer.next(data);    
			});
			return () => {

			};
		});
		return observable;
	}
	
}
