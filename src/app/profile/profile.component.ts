import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../core/interfaces/User';
import { AuthService } from '../core/services/auth.service';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  userSub: Subscription;
  editItem: User;

  constructor(private authService: AuthService, private dataService: DataService) { }

  ngOnInit() {
    console.log('ProfileComponent loaded');
    this.userSub = this.dataService.observableDatabase.User$
      .subscribe(user => {
        this.editItem = user;
        console.log('ProfileComponent: this.editItem: ', this.editItem);
      });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  updateItem(user: User) {
    this.authService.updateUser(user);
  }
}
