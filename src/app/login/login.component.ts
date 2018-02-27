import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { AuthService } from '../core/services/auth.service';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  userSub: Subscription;

  constructor(private dataService: DataService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    // If already logged in, go to booking instead of showing login page
    this.userSub = this.dataService.observableDatabase.User$
      .map(user => !!user)
      .subscribe(loggedIn => {
        if (loggedIn) {
          console.log('Already logged in');
          this.router.navigate(['/profile']);
        }
      });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  googleLogin() {
    this.authService.googleLogin();
  }



}
