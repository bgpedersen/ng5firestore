import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Activity } from '../interfaces/Activity';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Booking } from '../interfaces/Booking';
import { DatabaseInterface } from '../interfaces/Database';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { forkJoin } from 'rxjs/observable/forkJoin';


@Injectable()
export class DataService {

  public database: DatabaseInterface = {
    'Activities$': null as Observable<Activity[]>,
    'User$': this.angularFireAuth.authState,
    'ServerRefs': {}
  };

  // private database$ = new Subject<any>();
  // private database$ = new BehaviorSubject<DatabaseInterface>(this.database);

  // refSubs = {
  // 'activitySub': null as Subscription,
  // 'bookingSub': null as Subscription
  // };

  constructor(public db: AngularFirestore,
    private angularFireAuth: AngularFireAuth) {
    console.log('dataService init. this.database: ', this.database);
  }

  // Client Database
  // databaseUpdate(event: { type: string, payload?: any }) {
  //   console.log('DataService: databaseUpdate: event: ', event);
  //   if (event.type === 'Clear') {
  //     this.database = {
  //       'Activities': [],
  //       'Bookings': [],
  //       'User': {} as firebase.User
  //     };
  //   }
  //   if (event.type === 'Activities') {
  //     this.database.Activities = event.payload;
  //   }
  //   if (event.type === 'Bookings') {
  //     this.database.Bookings = event.payload;
  //   }
  //   if (event.type === 'User') {
  //     this.database.User = event.payload;
  //   }
  //   // Emit database
  //   console.log('DataService: databaseUpdate: this.database: ', this.database);
  //   this.database$.next(this.database);
  // }

  // databaseObservable(): Observable<any> {
  //   return this.database$.asObservable();
  // }

  // clearDatabase() {
  //   this.databaseUpdate({ type: 'Clear' });
  //   console.log('DataService: clearDatabase: this.database: ', this.database);
  // }

  clearServerRefs() {
    for (const key in this.database.ServerRefs) {
      if (this.database.ServerRefs[key]) {
        this.database.ServerRefs[key].unsubscribe();
      }
    }
    console.log('DataService: clearServerRefs: this.database: ', this.database);
  }

  initServerRefs() {
    this.fetchActivities();
    // this.fetchBookings();
  }

  // Connections
  fetchActivities() {
    // this.refSubs.activitySub = this.db.collection('activities')
    this.database.ServerRefs.Activities$ = this.db.collection('activities')
      .snapshotChanges()
      .map(arr => {
        return arr.map(snap => {
          console.log('dataService: fetchActivities: subscribe: snap: ', snap);
          const obj = snap.payload.doc.data();
          obj.id = snap.payload.doc.id;
          return new Activity(obj);
        });
      }).subscribe(res => {
        this.database.Activities = res;
      });
  }

  // Connections
  // fetchBookings() {
  //   this.refSubs.bookingSub = this.db.collection('bookings')
  //     .snapshotChanges()
  //     .map(arr => {
  //       return arr.map(snap => {
  //         const obj = snap.payload.doc.data();
  //         obj.id = snap.payload.doc.id;
  //         return new Booking(obj);
  //       });
  //     })
  //     .subscribe(response => {
  //       console.log('dataService: fetchBookings: subscribe: response: ', response);
  //       this.databaseUpdate({ type: 'Bookings', payload: response });
  //     });
  // }

  deleteAll(entityType: string) {
    // const transactionObservable = this.db.firestore.runTransaction(transaction => {

    //   const observables = [];
    //   const rel = this.db.collection('activities');

    //   for (let i = 0; i < this.database.Activities.length; i++) {
    //     const docRef = rel.doc(this.database.Activities[i].id);
    //     observables.push(transaction.delete(docRef));
    //   }

    //   return forkJoin(observables);
    // });


  }

  // AUTODATA(){
  //     // ONCE AUTO UPDATE ALL CUSTOM
  //     this.db.collection('activities')
  //     .snapshotChanges()
  //     .map(arr => {
  //       return arr.map(snap => {
  //         const obj = snap.payload.doc.data() as Activity;
  //         obj.id = snap.payload.doc.id;
  //         return obj;
  //       });
  //     })
  //     .subscribe(response => {
  //       console.log('dataService: fetchActivities: subscribe: response: ', response);
  //       let newArray: Activity[];
  //       for (let i = 0; i < response.length; i++) {
  //         let obj = new Activity({

  //         })
  //         response[i].title = "I changed the title of all";
  //       }
  //     });
  // }




}
