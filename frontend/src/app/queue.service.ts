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
