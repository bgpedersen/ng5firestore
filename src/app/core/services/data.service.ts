import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Activity } from '../interfaces/Activity';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ObservableDatabase, Database } from '../interfaces/Database';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { User } from '../interfaces/User';
import { AuthService } from './auth.service';
import { DocumentReference } from '@firebase/firestore-types';
import { combineLatest } from 'rxjs/observable/combineLatest';
import * as _ from 'lodash';


@Injectable()
export class DataService {

  serverRefs = {
    'ActivityRef': this.db.collection<Activity>('activities'),
    'UserRef': this.db.collection<User>('users')
  }

  // Non-readable database to keep the actual data to be exposed as observables
  private database: Database = {
    '_User': new BehaviorSubject(null),
    '_Users': new BehaviorSubject([]),
    '_Activities': new BehaviorSubject([])
  };

  // Readable database that exposes the data as observables
  public readonly observableDatabase: ObservableDatabase = {
    'User$': this.database._User.asObservable(),
    'Users$': this.database._Users.asObservable(),
    'Activities$': this.database._Activities.asObservable()
  }

  constructor(public db: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private authService: AuthService) {
    this.initDatabase();
  }

  // Keeps user up to date and only subscribes to server data when logged in
  initDatabase() {
    this.authService.user$
      .subscribe(user => {
        console.log('dataService: initDatabase: user: ', user);
        if (user) {
          // Logged in - update user and subscribe
          this.database._User.next(user);
          this.fetchActivities();
          this.fetchUsers();
        } else {
          // Kill subscribes ?
        }
      })
  }

  fetchActivities() {
    this.serverRefs.ActivityRef
      .snapshotChanges()
      .map(arr => {
        return arr.map(snap => {
          const fromCache = snap.payload.doc.metadata.fromCache;
          console.log('dataService: fetchActivities: map fromCache: ', fromCache);
          const obj = snap.payload.doc.data() as Activity;
          obj.id = snap.payload.doc.id;
          return obj;
        });
      })
      .subscribe(res => {
        console.log('dataService: fetchActivities: res: ', res);
        // this.database._Activities.next(res);
        this.getReferences(res, 'createdBy')
          .then((res: Activity[]) => {
            console.log('dataService: fetchActivities: res: ', res);
            this.database._Activities.next(res)
          });
      });
  }

  fetchUsers() {
    this.serverRefs.UserRef
      .snapshotChanges()
      .map(arr => {
        return arr.map(snap => {
          console.log('dataService: fetchUsers: map snap: ', snap);
          const obj = snap.payload.doc.data() as User;
          return obj;
        });
      })
      .subscribe(res => {
        console.log('dataService: fetchUsers: res: ', res);
        this.database._Users.next(res);
      });
  }

  addDataDetails(item, action) {
    // Adding fieldValue will make double read updates because time is added with a delay server-side !!!
    // item.timestamp = firebase.firestore.FieldValue.serverTimestamp();

    if (action === 'created') {
      item.createdBy = this.serverRefs.UserRef.doc(this.database._User.getValue().uid).ref;
      item.updatedBy = this.serverRefs.UserRef.doc(this.database._User.getValue().uid).ref;
      item.createdAt = new Date();
      item.updatedAt = new Date();
    }
    if (action === 'modified') {
      item.updatedBy = this.serverRefs.UserRef.doc(this.database._User.getValue().uid).ref;
      item.updatedAt = new Date();
    }

    return item;
  }

  updateOne(options: { item: any, ref: AngularFirestoreCollection<any> }) {
    const promise = new Promise((resolve, reject) => {

      if (options.item) {
        // Add data details
        options.item = this.addDataDetails(options.item, 'modified');

        // Convert object to pure javascript
        const item = Object.assign({}, options.item);

        console.log('dataService: updateOne: update item: ', item);
        options.ref.doc(item.id)
          .update(item)
          .then(() => {
            console.log('dataService: updateOne success');
            resolve(item.id);
          }).catch(err => {
            console.error('dataService: updateOne: error: ', err);
            reject(err);
          });
      } else {
        console.log('dataService: updateOne: wrong options! options: ', options);
        reject();
      }

    })

    return promise;
  }

  createOne(options: { item: any, ref: AngularFirestoreCollection<any> }) {
    const promise = new Promise((resolve, reject) => {

      if (options.item) {
        // Add data details
        options.item = this.addDataDetails(options.item, 'created');

        // Convert object to pure javascript
        const item = Object.assign({}, options.item);
        console.log('dataService: createOne: set item: ', item);

        options.ref.ref.add(item)
          .then((res) => {
            console.log('dataService: createOne success: res: ', res);
            resolve(res);
          }).catch(err => {
            console.error('dataService: createOne: error: ', err);
            reject(err);
          });
      } else {
        console.log('dataService: createOne: wrong options! options: ', options);
        reject();
      }
    })

    return promise;
  }

  deleteOne(options: { item: any, ref: AngularFirestoreCollection<any> }) {
    const promise = new Promise((resolve, reject) => {

      if (options.item) {
        // Convert object to pure javascript
        const item = Object.assign({}, options.item);
        console.log('dataService: deleteOne: update item: ', item);
        options.ref.doc(item.id)
          .delete()
          .then(() => {
            console.log('dataService: deleteOne success');
            resolve();
          }).catch(err => {
            console.error('dataService: deleteOne: error: ', err);
            reject(err);
          });
      } else {
        console.log('dataService: deleteOne: wrong options! options: ', options);
        reject();
      }

    })

    return promise;
  }

  createMany(options: { items: any[] }) {
    const promise = new Promise((resolve, reject) => {

      if (options.items && options.items.length) {
        const promises = [];
        for (let i = 0; i < options.items.length; i++) {
          promises.push(this.createOne({ 'item': options.items[i].item, 'ref': options.items[i].ref }));
        }
        forkJoin(promises).subscribe((res) => {
          console.log('dataService: createMany: forkJoin done: res: ', res);
          resolve(res);
        }, (err) => {
          console.error('dataService: createMany: error: ', err);
          reject(err);
        });
      } else {
        console.log('dataService: createMany: wrong options! options: ', options);
        reject();
      }

    })

    return promise;
  }

  deleteMany(options: { items: any[] }) {
    const promise = new Promise((resolve, reject) => {

      if (options.items && options.items.length) {
        const promises = [];
        for (let i = 0; i < options.items.length; i++) {
          promises.push(this.deleteOne({ 'item': options.items[i].item, 'ref': options.items[i].ref }));
        }
        forkJoin(promises).subscribe(() => {
          console.log('dataService: deleteMany: forkJoin done');
          resolve();
        }, (err) => {
          console.error('dataService: deleteMany: error: ', err);
          reject(err);
        });
      } else {
        console.log('dataService: deleteMany: wrong options! options: ', options);
        reject();
      }

    })

    return promise;
  }

  // combineReferences(refs: Array<Observable<DocumentReference>>) {
  //   return combineLatest<any[]>(refs)
  //     .map(arr => {
  //       return arr.map(doc => {
  //         const fromCache = doc.metadata.fromCache;
  //         console.log('dataService: combineReferences: map fromCache: ', fromCache);
  //         let data = doc.data();
  //         data.docId = doc.id;
  //         return data;
  //       })
  //     })
  // }


  // fetchActivities() {
  //   this.serverRefs.ActivityRef
  //     .snapshotChanges()
  //     .map(arr => {
  //       return arr.map(snap => {
  //         const fromCache = snap.payload.doc.metadata.fromCache;
  //         console.log('dataService: fetchActivities: map fromCache: ', fromCache);
  //         const obj = snap.payload.doc.data() as Activity;
  //         obj.id = snap.payload.doc.id;
  //         return obj;
  //       });
  //     })
  //     .subscribe(res => {
  //       console.log('dataService: fetchActivities: res: ', res);
  //       // this.database._Activities.next(res);
  //       this.getReferences(res, 'createdBy')
  //         .then((res: Activity[]) => this.database._Activities.next(res));
  //     });
  // }

  // Function to get references data and apply it to each item without duplicates
  getReferences(items, prop) {
    let promise = new Promise((resolve, reject) => {

      // var refs: Array<Observable<DocumentReference>> = [];
      var refs = [];

      var sortedItems = [];

      // Sort out duplicate refs
      for (let i = 0; i < items.length; i++) {
        let exists = false;
        for (let u = 0; u < sortedItems.length; u++) {
          if (sortedItems[u][prop].id === items[i][prop].id) {
            exists = true;
          }
        }
        if (!exists) {
          sortedItems.push(items[i]);
        }
      }

      // Create observables from refs
      for (let i = 0; i < sortedItems.length; i++) {
        console.log('dataService: getReferences: sortedItems[i][prop]: ', sortedItems[i][prop]);
        refs.push(
          this.db.doc(sortedItems[i][prop].path).snapshotChanges()
            .map(snap => {
              const fromCache = snap.payload.metadata.fromCache;
              console.log('dataService: fetchActivities: map fromCache: ', fromCache);
              const obj = snap.payload.data();
              obj.id = snap.payload.id;
              return obj;
            })
        );
        console.log('dataService: getReferences: refs: ', refs);
      }

      // Fetch each document reference and convert to data
      if (refs.length) {
        combineLatest<any[]>(refs)
          .take(1)
          .subscribe(res => {
            console.log('dataService: getReferences: res: ', res);
            // Add reference data to items
            for (let i = 0; i < items.length; i++) {
              for (let u = 0; u < res.length; u++) {
                if (items[i][prop].id === res[u].id) {
                  // Make sure not to override already existing relation data from other relations
                  if (_.has(items[i], 'relationData')) {
                    items[i].relationData[prop] = res[u];
                  } else {
                    items[i].relationData = {
                      [prop]: res[u]
                    };
                  }
                }
              }
            }
            // Return items with implemented data in each item
            resolve(items);
          })
      } else {
        resolve(items);
      }
    });

    return promise;

  }


















}
