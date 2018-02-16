import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/interfaces/User';

@Component({
  selector: 'app-shared-navigation',
  templateUrl: './shared-navigation.component.html',
  styleUrls: ['./shared-navigation.component.scss']
})
export class SharedNavigationComponent implements OnInit, OnDestroy {

  userSub: Subscription;
  user: User;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    console.log('SharedNavigationComponent loaded');
    this.userSub = this.authService.user
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
