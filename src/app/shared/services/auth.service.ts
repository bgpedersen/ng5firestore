import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  public user: Observable<firebase.User>;

  constructor(private angularFireAuth: AngularFireAuth,
    private router: Router) {
    this.user = this.angularFireAuth.authState;
  }

  signup(email: string, password: string) {
    this.angularFireAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(error => {
        console.error('auth.service: signup: error:', error.message);
      });
  }

  login(options) {
    // Google
    if (options.type === 'google') {
      this.angularFireAuth
        .auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(value => {
          console.log('auth.service: login: succes: ', value);
          this.router.navigate(['/chat']);
        }).catch(error => {
          console.error('auth.service: login: error: ', error.message);
        });
    }
    // Email & Password
    if (options.type === 'email') {
      this.angularFireAuth
        .auth
        .signInWithEmailAndPassword(options.email, options.password)
        .then(value => {
          console.log('auth.service: login: succes: ', value);
          this.router.navigate(['/chat']);
        }).catch(error => {
          console.error('auth.service: login: error: ', error.message);
        });
    }
  }

  logout() {
    this.angularFireAuth
      .auth
      .signOut().then(result => {
        console.log('auth.service: logout: succes: ', result);
        this.router.navigate(['/login']);
      }).catch(error => {
        console.error('auth.service: login: error: ', error);
      });

  }



}
