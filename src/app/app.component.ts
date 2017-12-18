import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  // Unsubscriber
  // private onDestroy$ = new Subject<void>();

  // user: Observable<firebase.User>;
  // users;

  // constructor(public angularFireAuth: AngularFireAuth,
  //   public db: AngularFirestore) {
  //   this.angularFireAuth.auth.signInAnonymously();
  //   this.user = this.angularFireAuth.authState;
  // }

  constructor(private authService: AuthService) {
  }


  ngOnInit() {

  }

  ngOnDestroy() {
  }



  // ngOnInit() {

  //   this.fetchUsers();
  // }

  // ngOnDestroy() {
  //   this.onDestroy$.next();
  //   this.onDestroy$.complete();
  // }

  // fetchUsers = function () {
  //   this.db.collection('users')
  //     .valueChanges()
  //     .takeUntil(this.onDestroy$)
  //     .subscribe(res => {
  //       console.log('fetchUsers: valueChanges: res: ', res);
  //       this.users = res;
  //     });

  //   this.db.collection('users')
  //     .snapshotChanges()
  //     .takeUntil(this.onDestroy$)
  //     .subscribe(res => {
  //       console.log('fetchUsers: snapshotChanges: res: ', res);
  //     });

  // };

  // fetchUser2 = function (id) {
  //   this.db.collection('users').doc(id)
  //     .valueChanges()
  //     .takeUntil(this.onDestroy$)
  //     .subscribe(res => console.log('fetchUser2: res: ', res));
  // }

  // updateUser(user) {

  // }

  // addUser(user) {
  //   this.db.collection('users').add(
  //     {
  //       'name': {
  //         'firstname': 'Thomas',
  //         'lastname': 'Nielsen'
  //       },
  //       'birthday': 1982,
  //       'email': 'tn@proreact.dk',
  //       'timestamp': new Date()
  //     }).then(docRef => {
  //       console.log('addUser: docRef: ', docRef);
  //     }).catch(error => {
  //       console.error('addUser: error: ', error);
  //     });
  // }
}
