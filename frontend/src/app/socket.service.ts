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
