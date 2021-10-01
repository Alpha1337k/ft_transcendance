import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

	constructor(private socket: Socket) {}

	sendMessage(msg: string) {
		this.socket.emit('message', msg);
	}

	connect() {
		if (this.socket.connect())
		{
			console.log("connected!!");
			this.socket.on("QueueUpdate", (data: number) => {
				console.log(data);
			})
		}
	}

	set_on(name: string, func: any)
	{
		this.socket.on(name, func);
	}
	
}
