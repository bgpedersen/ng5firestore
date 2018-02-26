import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../core/interfaces/User';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  refSubs = {
    'usersSub': null as Subscription
  };
  editItem: User;
  users: User[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    console.log('UsersComponent loaded');

    this.refSubs.usersSub = this.dataService.database.Users$
      .subscribe(res => {
        console.log('UsersComponent: New Users: res: ', res);
        this.users = this.convertItems(res);
      });
  }

  ngOnDestroy() {
    this.clearRefSubs();
  }

  // Convert items are unique convertions of the items for this component
  convertItems(items) {
    for (let i = 0; i < items.length; i++) {

    }
    return items;
  }

  clearRefSubs() {
    for (const key in this.refSubs) {
      if (this.refSubs[key]) {
        this.refSubs[key].unsubscribe();
      }
    }
    console.log('UsersComponent: clearRefSubs: this.refSubs: ', this.refSubs);
  }

  getItem(id) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].uid === id) {
        this.editItem = this.users[i];
        console.log('UsersComponent: getItem: this.editItem: ', this.editItem);
      }
    }
  }

}
