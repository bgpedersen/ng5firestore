import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { AlertMessage } from './core/interfaces/AlertMessage';
import { AlertService } from './core/services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  alertMessage: AlertMessage = null;

  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.alertListener();
  }

  ngOnDestroy() {
  }

  alertListener() {
    this.alertService.alertEvent
      .subscribe(value => {
        console.log('app.component: alertEvent: value: ', value);
        this.alertMessage = value;

        setTimeout(() => {
          this.alertMessage = null;
          console.log('app.component: alertEvent: resetting!');
        }, 2000);
      });
  }
}
