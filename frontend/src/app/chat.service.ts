import { ComponentRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ChatComponent } from './chat/chat.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
	private queueChangeSource = new Subject<any>();
	changeEmitted$ = this.queueChangeSource.asObservable();
	public openChats: ComponentRef<ChatComponent>[] = [];

	emitChange(change: any) {
		this.queueChangeSource.next(change);
	}
  constructor() { }
}
