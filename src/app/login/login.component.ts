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
    this.authService.getUser().map(res => {
      console.log('LoginComponen: getUser res: ', res);

      if (res) {
        this.router.navigate(['/activities']);
      }
      return false;
    })

  }

  login(options) {
    this.authService.login(options);
  }



}
