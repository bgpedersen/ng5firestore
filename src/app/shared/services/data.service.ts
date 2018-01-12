import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Activity } from '../interfaces/Activity';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Booking } from '../interfaces/Booking';
import { DatabaseInterface } from '../interfaces/Database';
import * as firebase from 'firebase/app';


@Injectable()
export class DataService {

  private database: DatabaseInterface = {
    'Activities': [],
    'Bookings': [],
    'User': {} as firebase.User
  };

  // private database$ = new Subject<any>();
  private database$ = new BehaviorSubject<DatabaseInterface>(this.database);

  activitiesCollection: AngularFirestoreCollection<Activity>;
  activitiesDoc: AngularFirestoreDocument<Activity>;
  bookingsCollection: AngularFirestoreCollection<Booking>;
  bookingsDoc: AngularFirestoreDocument<Booking>;

  constructor(public db: AngularFirestore) {

    console.log('dataService init. this.database: ', this.database);
    this.setupReferences();
    this.initServerState();
  }

  // Client Database
  databaseUpdate(event: { type: string, payload: any }) {
    if (event.type === 'Activities') {
      this.database.Activities = event.payload;
    }
    if (event.type === 'Bookings') {
      this.database.Bookings = event.payload;
    }
    if (event.type === 'User') {
      this.database.User = event.payload;
    }
    // Emit database
    this.database$.next(this.database);
  }

  databaseObservable(): Observable<any> {
    return this.database$.asObservable();
  }

  // Setup & Init
  setupReferences() {
    this.activitiesCollection = this.db.collection('activities');
    this.bookingsCollection = this.db.collection('bookings');
  }

  initServerState() {
    this.fetchActivities();
    this.fetchActivities();
  }

  // Connections
  fetchActivities() {
    this.activitiesCollection
      .snapshotChanges()
      .map(arr => {
        return arr.map(snap => {
          const obj = snap.payload.doc.data();
          obj.id = snap.payload.doc.id;
          return new Activity(obj);
        });
      })
      .subscribe(response => {
        console.log('dataService: fetchActivities: subscribe: response: ', response);
        this.databaseUpdate({ type: 'Activities', payload: response });
      });
  }

  // Connections
  fetchBookings() {
    this.bookingsCollection
      .snapshotChanges()
      .map(arr => {
        return arr.map(snap => {
          const obj = snap.payload.doc.data();
          obj.id = snap.payload.doc.id;
          return new Booking(obj);
        });
      })
      .subscribe(response => {
        console.log('dataService: fetchBookings: subscribe: response: ', response);
        this.databaseUpdate({ type: 'Bookings', payload: response });
      });
  }

  // AUTODATA(){
  //     // ONCE AUTO UPDATE ALL CUSTOM
  //     this.activitiesCollection
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
