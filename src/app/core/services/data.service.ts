import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Activity, ActivityInterface } from '../interfaces/Activity';
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
import { DocumentReference, CollectionReference, DocumentData } from '@firebase/firestore-types';
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

  // Global fetch collection and apply data information - returns observable
  fetchCollection(ref: AngularFirestoreCollection<any>) {
    return ref
      .snapshotChanges()
      .map(arr => {
        return arr.map(snap => {
          const fromCache = snap.payload.doc.metadata.fromCache;
          console.log('dataService: fetchCollection: map fromCache: ', fromCache);
          const obj = snap.payload.doc.data();
          obj.id = snap.payload.doc.id;
          return obj;
        });
      })
  }

  // Global fetch document and apply data information - returns observable
  fetchDocument(ref: AngularFirestoreDocument<any>) {
    return ref
      .snapshotChanges()
      .map(snap => {
        const fromCache = snap.payload.metadata.fromCache;
        console.log('dataService: fetchActivities: map fromCache: ', fromCache);
        const obj = snap.payload.data();
        obj.id = snap.payload.id;
        return obj;
      })
  };

  fetchActivities() {
    this.fetchCollection(this.serverRefs.ActivityRef)
      .subscribe((res: Activity[]) => {
        // Convert to Activities
        // for (let i = 0; i < res.length; i++) {
        //   res[i] = new Activity(res[i]);
        // }
        console.log('dataService: fetchActivities: converted activities: res: ', res);
        this.getReferences('Activity', res)
          .then((res: Activity[]) => {
            console.log('dataService: fetchActivities: after references: res: ', res);
            this.database._Activities.next(res);
          })
      });
  }

  // Function to get references data and apply it to each item without duplicates
  getReferences(type, items) {
    // console.log('dataService: getReferences: type: ', type, '. items: ', items);
    let promise = new Promise((resolve, reject) => {

      var allReferences = [];
      var sortedReferences = [];
      var observableReferences: Array<Observable<DocumentData>> = [];

      // Add all refs in one big array first
      for (let i = 0; i < items.length; i++) {
        if (type === 'Activity') {
          if (items[i].relationData && items[i].relationData.createdBy) {
            allReferences.push(items[i].relationData.createdBy.ref);
          }
          if (items[i].relationData && items[i].relationData.updatedBy) {
            allReferences.push(items[i].relationData.createdBy.ref);
          }
        }
      }
      // console.log('dataService: getReferences: allReferences: ', allReferences);

      // Sort out duplicates refs
      sortedReferences = _.uniqBy(allReferences, 'id');
      // console.log('dataService: getReferences: sortedReferences: ', sortedReferences);

      // Create observables from refs using the fetchDocument function
      for (let i = 0; i < sortedReferences.length; i++) {
        observableReferences.push(this.fetchDocument(this.db.doc(sortedReferences[i].path)));
      }
      // console.log('dataService: getReferences: observableReferences: ', observableReferences);

      // Fetch each document reference data
      if (observableReferences.length) {
        combineLatest<any[]>(observableReferences)
          .take(1)
          .subscribe((refData: any[]) => {
            console.log('dataService: getReferences: combineLatest: refData: ', refData, '. items: ', items);

            // Add data to items
            for (let k = 0; k < refData.length; k++) {
              for (let i = 0; i < items.length; i++) {
                if (type === 'Activity') {
                  if (items[i].relationData.createdBy.ref.id === refData[k].id) {
                    items[i].relationData.createdBy.data = refData[k];
                  }
                  if (items[i].relationData.updatedBy.ref.id === refData[k].id) {
                    items[i].relationData.updatedBy.data = refData[k];
                  }
                }
              }
            }
            console.log('dataService: getReferences: DONE: items: ', items);

            // Return items with implemented data in each item
            resolve(items);
          })
      } else {
        console.log('dataService: getReferences: DONE (no references): items: ', items);
        resolve(items);
      }
    });

    return promise;
  }



  fetchUsers() {
    this.fetchCollection(this.serverRefs.UserRef)
      .subscribe((res: User[]) => {
        console.log('dataService: fetchUsers: res: ', res);
        this.database._Users.next(res);
      });
  }

  addDataDetails(item, action) {
    // Adding fieldValue will make double read updates because time is added with a delay server-side !!!
    // item.timestamp = firebase.firestore.FieldValue.serverTimestamp();

    if (action === 'created') {
      item.relationData.createdBy.ref = this.serverRefs.UserRef.doc(this.database._User.getValue().uid).ref;
      item.relationData.updatedBy.ref = this.serverRefs.UserRef.doc(this.database._User.getValue().uid).ref;
      item.createdAt = new Date();
      item.updatedAt = new Date();
    }
    if (action === 'modified') {
      item.relationData.updatedBy.ref = this.serverRefs.UserRef.doc(this.database._User.getValue().uid).ref;
      console.log('dataService: addDataDetails: item.relationData.updatedBy.ref: ', item.relationData.updatedBy.ref);
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
    console.log('dataService: createMany: options.items: ', options.items);
    const promise = new Promise((resolve, reject) => {
      // Create batch
      let batch = this.db.firestore.batch();

      if (options.items && options.items.length) {
        for (let i = 0; i < options.items.length; i++) {
          // Add data details
          options.items[i].item = this.addDataDetails(options.items[i].item, 'created');

          // Convert object to pure javascript
          const item = Object.assign({}, options.items[i].item);
          // Insert to batch
          batch.set(options.items[i].ref, item);
        }
        // Commit the batch
        batch.commit()
          .then((res) => {
            console.log('dataService: createMany: batch commit done!');
            resolve();
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
    console.log('dataService: deleteMany: options.items: ', options.items);
    const promise = new Promise((resolve, reject) => {
      // Create batch
      let batch = this.db.firestore.batch();

      if (options.items && options.items.length) {
        for (let i = 0; i < options.items.length; i++) {
          // Insert to batch
          batch.delete(options.items[i].ref);
        }
        // Commit the batch
        batch.commit()
          .then((res) => {
            console.log('dataService: deleteMany: batch commit done!');
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

    // const promise = new Promise((resolve, reject) => {

    //   if (options.items && options.items.length) {
    //     const promises = [];
    //     for (let i = 0; i < options.items.length; i++) {
    //       promises.push(this.deleteOne({ 'item': options.items[i].item, 'ref': options.items[i].ref }));
    //     }
    //     forkJoin(promises).subscribe(() => {
    //       console.log('dataService: deleteMany: forkJoin done');
    //       resolve();
    //     }, (err) => {
    //       console.error('dataService: deleteMany: error: ', err);
    //       reject(err);
    //     });
    //   } else {
    //     console.log('dataService: deleteMany: wrong options! options: ', options);
    //     reject();
    //   }

    // })

    return promise;
  }





}
