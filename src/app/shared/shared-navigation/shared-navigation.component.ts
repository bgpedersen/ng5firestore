import { DatabaseInterface } from '../interfaces/Database';
import { DataService } from '../services/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';

@Component({
  selector: 'app-shared-navigation',
  templateUrl: './shared-navigation.component.html',
  styleUrls: ['./shared-navigation.component.scss']
})
export class SharedNavigationComponent implements OnInit, OnDestroy {

  userSub: Subscription;
  user = {} as firebase.User;

  constructor(private authService: AuthService,
    private dataService: DataService) { }

  ngOnInit() {
    console.log('SharedNavigationComponent loaded');
    this.userSub = this.dataService.database.User$
      .subscribe(user => {
        this.user = user;
        console.log('SharedNavigationComponent: this.user: ', this.user);
      });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

}
