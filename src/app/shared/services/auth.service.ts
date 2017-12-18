import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  // private user: Observable<firebase.User>;
  private user;

  constructor(private angularFireAuth: AngularFireAuth,
    private router: Router) {
    // this.user = this.angularFireAuth.authState;
    this.angularFireAuth.authState.map(user => {
      console.log('AuthService: checkAuthStatus: ', user);
      this.user = user;
    });
  }

  checkAuthStatus() {
    return this.user;
  }

  login(type) {
    if (type === 'google') {
      this.angularFireAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      this.router.navigate(['/chat']);
    }
  }

  logout() {
    console.log('AuthService: logging out...');
    this.angularFireAuth.auth.signOut();
    this.router.navigate(['/login']);
  }



}
