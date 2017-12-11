import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: Observable<firebase.User>;
  items: any[];
  itemsRef;

  constructor(public angularFireAuth: AngularFireAuth,
    angularFirestore: AngularFirestore) {
    this.angularFireAuth.auth.signInAnonymously();
    this.user = this.angularFireAuth.authState;
    angularFirestore.collection('items').valueChanges().subscribe(res => {
      this.items = res;
      console.log('this.items: ', this.items)
    });

    this.itemsRef = angularFirestore.collection('items');
  }

  ngOnInit() {
  }

}
