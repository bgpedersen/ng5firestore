import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { AlertService } from './alert.service';

@Injectable()
export class AuthService {

  public user: Observable<firebase.User>;

  constructor(private angularFireAuth: AngularFireAuth,
    private router: Router,
    private alertService: AlertService) {
    this.user = this.angularFireAuth.authState;
  }

  signup(email: string, password: string) {
    this.angularFireAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
        this.alertService.createAlert({ 'type': 'success', 'message': 'Successfully created user' });
      })
      .catch(error => {
        console.error('auth.service: signup: error:', error.message);
        this.alertService.createAlert({ 'type': 'danger', 'message': 'Error: ' + error.message });
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
          this.alertService.createAlert({ 'type': 'success', 'message': 'Successfully signed in' });
          this.router.navigate(['/chat']);
        }).catch(error => {
          console.error('auth.service: login: error: ', error.message);
          this.alertService.createAlert({ 'type': 'danger', 'message': 'Error: ' + error.message });
        });
    }
    // Anonymously
    if (options.type === 'anonymously') {
      this.angularFireAuth
        .auth
        .signInAnonymously()
        .then(value => {
          console.log('auth.service: login: succes: ', value);
          this.alertService.createAlert({ 'type': 'success', 'message': 'Successfully signed in' });
          this.router.navigate(['/chat']);
        }).catch(error => {
          console.error('auth.service: login: error: ', error.message);
          this.alertService.createAlert({ 'type': 'danger', 'message': 'Error: ' + error.message });
        });
    }
    // Email & Password
    if (options.type === 'email') {
      this.angularFireAuth
        .auth
        .signInWithEmailAndPassword(options.email, options.password)
        .then(value => {
          console.log('auth.service: login: succes: ', value);
          this.alertService.createAlert({ 'type': 'success', 'message': 'Successfully signed in' });
          this.router.navigate(['/chat']);
        }).catch(error => {
          console.error('auth.service: login: error: ', error.message);
          this.alertService.createAlert({ 'type': 'danger', 'message': 'Error: ' + error.message });
        });
    }
  }

  logout() {
    this.angularFireAuth
      .auth
      .signOut().then(result => {
        console.log('auth.service: logout: succes: ', result);
        this.alertService.createAlert({ 'type': 'success', 'message': 'Successfully logged out' });
        this.router.navigate(['/login']);
      }).catch(error => {
        console.error('auth.service: login: error: ', error);
        this.alertService.createAlert({ 'type': 'danger', 'message': 'Error: ' + error.message });
      });

  }



}