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
import { User } from '../interfaces/User';
import { AuthService } from './auth.service';


@Injectable()
export class DataService {

  public database: DatabaseInterface = {
    'User': {} as User,
    'Activities': [] as Activity[],
    'Users': [] as User[],
    'ServerRefs': {
      'ActivityRef': this.db.collection<Activity>('activities'),
      'UserRef': this.db.collection<User>('users')
    },
    'ServerSubs': {}
  };

  public databaseUpdate$ = new Subject<any>();
  // private database$ = new BehaviorSubject<DatabaseInterface>(this.database);

  // refSubs = {
  // 'activitySub': null as Subscription,
  // 'bookingSub': null as Subscription
  // };

  constructor(public db: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private authService: AuthService) {
    this.authService.user
      .subscribe(user => {
        if (user) {
          this.database.User = user;
          console.log('DataService: this.database.User: ', this.database.User);
          this.initServerSubs();
        } else {
          this.clearServerSubs();
        }
      });
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



  clearServerSubs() {
    for (const key in this.database.ServerSubs) {
      if (this.database.ServerSubs[key]) {
        this.database.ServerSubs[key].unsubscribe();
      }
    }
    console.log('DataService: clearServerSubs: this.database: ', this.database);
  }

  initServerSubs() {
    this.fetchActivities();
    this.fetchUsers();
    // this.fetchBookings();
  }

  // Connections
  fetchActivities() {
    // this.refSubs.activitySub = this.db.collection('activities')
    this.database.ServerSubs.Activities$ = this.database.ServerRefs.ActivityRef
      .snapshotChanges()
      .map(arr => {
        return arr.map(snap => {
          // console.log('dataService: fetchActivities: subscribe: snap: ', snap);
          const obj = snap.payload.doc.data();
          obj.id = snap.payload.doc.id;
          return new Activity(obj);
        });
      }).subscribe(res => {
        this.database.Activities = res;
        this.databaseUpdate$.next();
        console.log('dataService: fetchActivities: this.database.Activities: ', this.database.Activities);
      });
  }

  // Connections
  fetchUsers() {
    console.log('DataService: fetchUsers called');
    this.database.ServerSubs.Users$ = this.database.ServerRefs.UserRef
      .snapshotChanges()
      .map(arr => {
        return arr.map(snap => {
          const obj = snap.payload.doc.data() as User;
          return obj;
        });
      }).subscribe(res => {
        this.database.Users = res;
        this.databaseUpdate$.next();
        console.log('dataService: fetchUsers: this.database.Users: ', this.database.Users);
      });
  }

  createOne(options: { item: any, ref: AngularFirestoreCollection<any> }) {

    if (options.item) {
      options.ref.add(Object.assign({}, options.item))
        .then(() => {
          console.log('dataService: createOne: forkJoin done');
        }).catch(err => {
          console.error('dataService: createOne: error: ', err);
        });
    } else {
      console.log('dataService: createOne: wrong options! options: ', options);
    }
  }

  createMany(options: { items: any[], ref: AngularFirestoreCollection<any> }) {
    const promises = [];

    if (options.items && options.items.length) {
      for (let i = 0; i < options.items.length; i++) {
        promises.push(options.ref.add(Object.assign({}, options.items[i])));
      }
      forkJoin(promises).subscribe(() => {
        console.log('dataService: createMany: forkJoin done');
      }, (err) => {
        console.error('dataService: createMany: error: ', err);
      });
    } else {
      console.log('dataService: createMany: wrong options! options: ', options);
    }
  }

  deleteAll(options: { items: any[], ref: AngularFirestoreCollection<any> }) {
    const promises = [];

    if (options.items && options.items.length) {
      for (let i = 0; i < options.items.length; i++) {
        promises.push(options.ref.doc(options.items[i].id).delete());
      }
      forkJoin(promises).subscribe(() => {
        console.log('dataService: deleteAll: forkJoin done');
      }, (err) => {
        console.error('dataService: deleteAll: error: ', err);
      });
    } else {
      console.log('dataService: deleteAll: wrong options! options: ', options);
    }
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


}
