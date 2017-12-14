import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  // Unsubscriber
  private onDestroy$ = new Subject<void>();

  user: Observable<firebase.User>;
  users: any[];

  collectionUsers;

  constructor(public angularFireAuth: AngularFireAuth,
    public angularFirestore: AngularFirestore) {
    this.angularFireAuth.auth.signInAnonymously();
    this.user = this.angularFireAuth.authState;
    this.collectionUsers = this.angularFirestore.collection('users');
  }

  ngOnInit() {
    this.fetchUsers();
    this.fetchUser();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  fetchUsers = function () {
    this.collectionUsers
      .valueChanges()
      .takeUntil(this.onDestroy$)
      .subscribe(res => {
        this.users = res;
        console.log('this.users: ', this.users);
      });


    this.collectionUsers
      .snapshotChanges()
      .takeUntil(this.onDestroy$)
      .subscribe(res => {
        this.users = res;
        console.log('this.users: ', this.users);
      });

  };


  fetchUser = function () {
    this.angularFirestore.doc('users/MNDJgw0r6pTTheBkfqek')
      .valueChanges()
      .takeUntil(this.onDestroy$)
      .subscribe(res => console.log(res));
  }

  updateUser(user) {

  }

  addUser(user) {
    this.collectionUsers.add({ 'firstname': 'Thomas', 'lastname': 'Nielsen', 'birthday': 1982, 'email': 'tn@proreact.dk' });
  }

}
