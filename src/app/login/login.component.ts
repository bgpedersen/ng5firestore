import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    // handle any redirects if a user is authenticated
    let user = this.authService.checkAuthStatus();
    console.log('login.component: user: ', user);
    if (user) {
      // redirect the user
      this.router.navigate(['/chat']);
      return;
    }
  }

  login(type) {
    this.authService.login(type);
  }



}
