import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private trigger = new Subject<void>();

  triggerObservable$ = this.trigger.asObservable();

  updateUser() {
    this.trigger.next();
  }
}
