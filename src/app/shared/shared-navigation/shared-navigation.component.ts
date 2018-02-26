import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/interfaces/User';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-shared-navigation',
  templateUrl: './shared-navigation.component.html',
  styleUrls: ['./shared-navigation.component.scss']
})
export class SharedNavigationComponent implements OnInit, OnDestroy {

  refSubs = {
    'userSub': null as Subscription
  };
  user: User;

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit() {
    console.log('SharedNavigationComponent loaded');

    this.refSubs.userSub = this.dataService.database.User$
      .subscribe(user => {
        this.user = user;
        console.log('SharedNavigationComponent: this.user: ', this.user);
      })
  }

  ngOnDestroy() {
    this.clearRefSubs();
  }

  clearRefSubs() {
    for (const key in this.refSubs) {
      if (this.refSubs[key]) {
        this.refSubs[key].unsubscribe();
      }
    }
    console.log('SharedNavigationComponent: clearRefSubs: this.refSubs: ', this.refSubs);
  }

  logout() {
    this.authService.logout();
  }

}


