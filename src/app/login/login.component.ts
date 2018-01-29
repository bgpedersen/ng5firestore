import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  userSub: Subscription;

  constructor(private authService: AuthService,
    private dataService: DataService,
    private router: Router) { }

  ngOnInit() {
    // If already logged in, go to booking instead of showing login page
    this.userSub = this.dataService.database.User$
      .subscribe(user => {
        if (user) {
          console.log('LoginComponent: user: ', user);
          this.router.navigate(['/bookings']);
        }
      });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  login(options) {
    this.authService.login(options);
  }



}
