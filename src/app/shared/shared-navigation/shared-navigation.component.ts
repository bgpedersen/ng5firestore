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
    'databaseSub': null as Subscription
  };
  user: User;

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit() {
    console.log('SharedNavigationComponent loaded');

    // Init get all items
    this.getItems();

    this.refSubs.databaseSub = this.dataService.databaseUpdate$.subscribe(res => {
      console.log('SharedNavigationComponent: database updated! this.dataService.database: ', this.dataService.database);
      this.getItems();
    });
  }

  ngOnDestroy() {
    this.clearRefSubs();
  }

  getItems() {
    this.user = this.dataService.database.User;
    console.log('SharedNavigationComponent: getItems: this.user: ', this.user);
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


