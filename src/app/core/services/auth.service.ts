import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { User } from '../interfaces/User';
import { DataService } from './data.service';

@Injectable()
export class AuthService {

  user$: Observable<User>;

  constructor(private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private router: Router) {

    this.user$ = this.angularFireAuth.authState
      .switchMap(user => {
        if (user) {
          return this.angularFirestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });
  }

  getUser() {
    return this.user$;
  }

  updateUser(user) {
    console.log('authService: updateUser: user: ', user);
    const userRef = this.angularFirestore.doc(`users/${user.uid}`);

    userRef.update(user).then(() => {
      console.log('authService: updateUser success');
    }, (error) => {
      console.log('authService: updateUser error: ', error);
    });
  }

  createUser(user) {
    console.log('authService: createUser: user: ', user);
    const userRef = this.angularFirestore.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      favoriteColor: '#FFF'
    };

    userRef.set(data).then(() => {
      console.log('authService: createUser success');
    }, (error) => {
      console.log('authService: createUser error: ', error);
    });
  }

  checkIfUserExists(user) {
    // Sets user data to firestore on login
    console.log('authService: checkIfUserExists: user: ', user);
    const userRef = this.angularFirestore.doc(`users/${user.uid}`);
    return userRef.snapshotChanges()
      .take(1)
      .map(snap => {
        console.log('authService: checkIfUserExists: snap: ', snap);
        const exists = snap.payload.exists;
        console.log('authService: checkIfUserExists: exists: ', exists);
        return exists;
      });
  }

  private oAuthLogin(provider) {
    this.angularFireAuth.auth.signInWithPopup(provider)
      .then(credential => {
        console.log('authService: oAuthLogin: credential: ', credential);
        this.checkIfUserExists(credential.user)
          .subscribe(exists => {
            if (!exists) {
              this.createUser(credential.user);
            }
          });
      });
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.oAuthLogin(provider);
  }

  logout() {
    this.angularFireAuth.auth.signOut()
      .then(() => {
        this.router.navigate(['/']);
      });
  }



}
