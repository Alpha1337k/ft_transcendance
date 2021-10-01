import { Component, ViewContainerRef, ComponentFactoryResolver} from '@angular/core';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pong';
  count = 0;
  userid = 1;

	constructor (private ws : SocketService) {
		
	}
	
  ngOnInit(): void {
	this.count = 1;
	this.ws.connect()
	
	}
	test() {
		
	}
}
