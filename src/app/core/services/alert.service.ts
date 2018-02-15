import { AlertMessage } from '../interfaces/AlertMessage';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class AlertService {
  alertEvent: EventEmitter<any> = new EventEmitter();
  // Types
  alertTypes = [
    'success',
    'info',
    'warning',
    'danger',
    'primary',
    'secondary',
    'light',
    'dark'
  ];

  constructor() { }

  createAlert(alertMessage: AlertMessage) {
    if (!alertMessage.type) {
      alertMessage.type = this.alertTypes[0];
    }
    if (!alertMessage.message) {
      alertMessage.message = 'EMPTY MESSAGE';
    }
    this.alertEvent.emit(alertMessage);
  }

}
