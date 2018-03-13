import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, DocumentReference } from '@firebase/firestore-types';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Activity } from '../interfaces/Activity';
import { Database, ObservableDatabase } from '../interfaces/Database';
import { Group } from '../interfaces/Group';
import { User } from '../interfaces/User';
import { AuthService } from './auth.service';

@Injectable()
export class DataService {

  public serverRefs = {
    ActivityRef: this.db.collection<Activity>('activities'),
    GroupRef: this.db.collection<Group>('groups'),
    UserRef: this.db.collection<User>('users'),
  };

  public readonly observableDatabase: ObservableDatabase;

  private listeners = [];

  // Non-readable database to keep the actual data to be exposed as observables
  private database: Database = {
    _User: new BehaviorSubject(null),
    _Users: new BehaviorSubject([]),
    _Activities: new BehaviorSubject([]),
    _ActivitiesByGroupId: new BehaviorSubject([]),
    _Groups: new BehaviorSubject([]),
  };

  constructor(public db: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private authService: AuthService) {
    // Readable database that exposes the data as observables
    this.observableDatabase = {
      User$: this.database._User.asObservable(),
      Users$: this.database._Users.asObservable(),
      Activities$: this.database._Activities.asObservable(),
      ActivitiesByGroupId$: this.database._ActivitiesByGroupId.asObservable(),
      Groups$: this.database._Groups.asObservable(),
    };
    this.initDatabase();
  }

  // Keeps user up to date and only subscribes to server data when logged in
  initDatabase() {
    this.authService.user$
      .subscribe((user) => {
        console.log('dataService: initDatabase: user: ', user);
        if (user) {
          // Logged in - update user and subscribe
          this.database._User.next(user);
          // this.fetchActivities();

          this.fetchGroups();
          this.fetchUsers();

          // Listen on Group collection change and fetch activities with group ids
          this.database._Groups.subscribe((groups) => {

            console.log('dataService: initDatabase: this.database._Groups.subscribe((groups): ', groups);
            if (groups.length) {
              this.fetchActivitiesWithGroups(groups);
            }
          });

        } else {
          // Kill subscribes ?
        }
      });
  }

  //   const size$ = new Subject<string>();
  // const queryObservable = size$.switchMap(size =>
  //   afs.collection('items', ref => ref.where('size', '==', size)).valueChanges();
  // );

  // // subscribe to changes
  // queryObservable.subscribe(queriedItems => {
  //   console.log(queriedItems);
  // });

  // // trigger the query
  // size$.next('large');

  // // re-trigger the query!!!
  // size$.next('small');

  fetchActivitiesWithGroups(groups) {
    const observableFilterCollections = [];
    for (const group of groups) {
      observableFilterCollections.push(this.fetchActivitiesByGroupId(group.id));
    }

    combineLatest<any[]>(observableFilterCollections)
      .subscribe((res: any[]) => {
        console.log('dataService: fetchActivitiesWithGroups: res: ', res);
        let convertedRes = [];
        convertedRes = _.flatten(res);
        convertedRes = _.uniqBy(convertedRes, 'id');
        console.log('dataService: fetchActivitiesWithGroups: convertedRes: ', convertedRes);
        this.database._ActivitiesByGroupId.next(convertedRes);
      });

    // let query = this.db.collection<Activity>('activities', (ref) => ref.where('relationsById.' + groups[0].id, '==', true));
    // this.fetchCollection(query)
    //   .subscribe((res: Activity[]) => {
    //     console.log('dataService: fetchActivities: res: ', res);
    //     this.database._ActivitiesByGroupId.next(res);
    //   });


    // OBS: Nothing is checking which groups with activity collections is currently being streamed - listener seems just to be a function and not something to be cancelled
    // const listeners = [];
    // for (const group of groups) {
    //   listeners.push(this.fetchActivitiesByGroupId(group.id));
    // }
    // console.log('dataService: fetchActivitiesWithGroups: listeners: ', listeners);

    // // combineLatest<any[]>(listeners)
    // //   .subscribe((res: any[]) => {
    // Promise.all(listeners).then(res => {
    //   console.log('dataService: fetchActivitiesWithGroups: res: ', res);
    //   const newFetches = [];
    //   res.forEach((querySnapshot) => {
    //     console.log('dataService: fetchActivitiesWithGroups: querySnapshot.metadata.fromCache: ', querySnapshot.metadata.fromCache);
    //     console.log('dataService: fetchActivitiesWithGroups: querySnapshot: ', querySnapshot);

    //     querySnapshot.docs.forEach((doc) => {
    //       console.log('dataService: fetchActivitiesWithGroups: doc.metadata.fromCache: ', doc.metadata.fromCache);
    //       console.log('dataService: fetchActivitiesWithGroups: doc: ', doc);

    //       const activity = doc.data();
    //       activity.id = doc.id;
    //       newFetches.push(activity);
    //     });
    //   });
    //   console.log('dataService: fetchActivitiesWithGroups: newFetches: ', newFetches);
    //   // Get current activities array
    //   const existingActivities = this.database._ActivitiesByGroupId.getValue();
    //   // Add new activity to array if not already exists
    //   for (const newFetch of newFetches) {
    //     const exists = _.findIndex(existingActivities, { id: newFetch.id });
    //     if (exists === -1) {
    //       existingActivities.push(newFetch);
    //     }
    //   }
    //   console.log('dataService: fetchActivitiesWithGroups: existingActivities: ', existingActivities);
    //   // Update observable with new array
    //   this.database._ActivitiesByGroupId.next(existingActivities);
    // });

    // this.fetchActivitiesByGroupId('47zT1Hnq6HlN5TVOAumG');
    // this.fetchActivitiesByGroupId('87DjrXy3wYZsybYcGGLY');
    // this.fetchActivitiesByGroupId('B65mO7qeJAMXxUzkiM2e');
    // this.fetchActivitiesByGroupId('BfnApPg3dU3M7kemJU65');
  }

  fetchActivitiesByGroupId(id) {
    console.log('dataService: fetchActivitiesByGroupId: id: ', id);
    const query = this.db.collection<Activity>('activities', (ref) => ref.where('relationsById.' + id, '==', true));
    return this.fetchCollection(query);


    // return new Promise((resolve, reject) => {
    //   this.serverRefs.ActivityRef.ref.where('relationsById.' + id, '==', true).get().then((querySnapshot) => {
    //     resolve(querySnapshot);
    //   });
    // });

    // return this.serverRefs.ActivityRef.ref.where('relationsById.' + id, '==', true).onSnapshot((res) => res);

    // const queryRef = this.serverRefs.ActivityRef.ref.where('relationsById.' + id, '==', true);
    // queryRef.onSnapshot((querySnapshot) => {

    //   const newFetches = [];
    //   querySnapshot.forEach((doc) => {
    //     console.log('dataService: fetchActivitiesByGroupId: doc.metadata.fromCache: ', doc.metadata.fromCache);
    //     console.log('dataService: fetchActivitiesByGroupId: doc: ', doc);
    //     const activity = doc.data();
    //     activity.id = doc.id;
    //     newFetches.push(activity);
    //   });
    //   // Get current activities array
    //   const existingActivities = this.database._ActivitiesByGroupId.getValue();
    //   // Add new activity to array if not already exists
    //   for (const newFetch of newFetches) {
    //     const exists = _.findIndex(existingActivities, { id: newFetch.id });
    //     if (exists === -1) {
    //       existingActivities.push(newFetch);
    //     }
    //   }
    //   console.log('dataService: fetchActivitiesByGroupId: existingActivities: ', existingActivities);
    //   // Update observable with new array
    //   this.database._ActivitiesByGroupId.next(existingActivities);
    // });
  }

  // **** Global fetch collection/document and apply data information - returns observable
  fetchCollection(ref: AngularFirestoreCollection<any>) {
    return ref
      .snapshotChanges()
      .map((arr) => {
        return arr.map((snap) => {
          const fromCache = snap.payload.doc.metadata.fromCache;
          console.log('dataService: fetchCollection: map fromCache: ', fromCache);
          const obj = snap.payload.doc.data();
          obj.id = snap.payload.doc.id;
          return obj;
        });
      });
  }

  fetchDocument(ref: AngularFirestoreDocument<any>) {
    return ref
      .snapshotChanges()
      .map((snap) => {
        const fromCache = snap.payload.metadata.fromCache;
        console.log('dataService: fetchActivities: map fromCache: ', fromCache);
        const obj = snap.payload.data();
        obj.id = snap.payload.id;
        return obj;
      });
  }

  // **** Global fetch end

  fetchActivities() {
    this.fetchCollection(this.serverRefs.ActivityRef)
      .subscribe((res: Activity[]) => {
        console.log('dataService: fetchActivities: res: ', res);
        this.getReferences('Activity', res)
          .then((resWithRefs: Activity[]) => {
            console.log('dataService: fetchActivities: after references: resWithRefs: ', resWithRefs);
            this.database._Activities.next(resWithRefs);
          });
      });
  }

  fetchGroups() {
    this.fetchCollection(this.serverRefs.GroupRef)
      .subscribe((res: Group[]) => {
        console.log('dataService: fetchGroups: res: ', res);
        this.getReferences('Group', res)
          .then((resWithRefs: Group[]) => {
            console.log('dataService: fetchGroups: after references: resWithRefs: ', resWithRefs);
            this.database._Groups.next(resWithRefs);
          });
      });
  }

  // Function to get references data and apply it to each item without duplicates
  getReferences(type, items) {
    // console.log('dataService: getReferences: type: ', type, '. items: ', items);
    const promise = new Promise((resolve, reject) => {

      let allReferences = [];
      let sortedReferences = [];
      let observableReferences: Array<Observable<DocumentData>> = [];

      // Add all refs in one big array first
      for (let i = 0; i < items.length; i++) {
        // Global for all
        if (items[i].relationData.createdBy) {
          allReferences.push(items[i].relationData.createdBy.ref);
        }
        if (items[i].relationData.updatedBy) {
          allReferences.push(items[i].relationData.updatedBy.ref);
        }
        // Specifics
        if (type === 'Activity') {
          if (items[i].relationData.groups) {
            for (let u = 0; u < items[i].relationData.groups.length; u++) {
              allReferences.push(items[i].relationData.groups[u].ref);
            }
          }
        }
        if (type === 'Group') {
          if (items[i].relationData.activities) {
            for (let u = 0; u < items[i].relationData.activities.length; u++) {
              allReferences.push(items[i].relationData.activities[u].ref);
            }
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
                // Global for all
                if (items[i].relationData.createdBy.ref.id === refData[k].id) {
                  items[i].relationData.createdBy.data = refData[k];
                }
                if (items[i].relationData.updatedBy.ref.id === refData[k].id) {
                  items[i].relationData.updatedBy.data = refData[k];
                }
                // Specifics
                if (type === 'Activity') {
                  if (items[i].relationData.groups) {
                    for (let u = 0; u < items[i].relationData.groups.length; u++) {
                      if (items[i].relationData.groups[u].ref.id === refData[k].id) {
                        items[i].relationData.groups[u].data = refData[k];
                      }
                    }
                  }
                }
                if (type === 'Group') {
                  if (items[i].relationData.activities) {
                    for (let u = 0; u < items[i].relationData.activities.length; u++) {
                      if (items[i].relationData.activities[u].ref.id === refData[k].id) {
                        items[i].relationData.activities[u].data = refData[k];
                      }
                    }
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

    const userRef = this.serverRefs.UserRef.doc(this.database._User.getValue().uid).ref;

    if (action === 'created') {
      item.relationData.createdBy.ref = userRef;
      item.relationData.updatedBy.ref = userRef;
      item.createdAt = new Date();
      item.updatedAt = new Date();
    }
    if (action === 'modified') {
      item.relationData.updatedBy.ref = userRef;
      item.updatedAt = new Date();
    }

    return item;
  }

  updateOne(option: { item: any, ref: AngularFirestoreCollection<any>, type?: string }) {
    const promise = new Promise((resolve, reject) => {

      if (option.item) {
        // Add data details
        let item = this.addDataDetails(option.item, 'modified');

        // Convert object to pure javascript
        item = item.convertToDatabaseModel();

        console.log('dataService: updateOne: update item: ', item);
        option.ref.doc(item.id)
          .update(item)
          .then(() => {
            console.log('dataService: updateOne success');
            resolve(item.id);
          }).catch((err) => {
            console.error('dataService: updateOne: error: ', err);
            reject(err);
          });
      } else {
        console.log('dataService: updateOne: wrong option! option: ', option);
        reject();
      }

    });

    return promise;
  }

  createOne(option: { item: any, ref: AngularFirestoreCollection<any>, type?: string }) {
    const promise = new Promise((resolve, reject) => {

      console.log('dataService: createOne: option: ', option);

      if (option.item) {
        // Add data details
        let item = this.addDataDetails(option.item, 'created');

        // Add random groups to activity
        if (option.type === 'Activity') {
          const groups = this.database._Groups.getValue();
          console.log('dataService: createOne: groups: ', groups);
          for (const group of groups) {
            // item.relationsById[group.id] = this.db.collection('Groups').doc(group.id).ref;
            item.relationsById[group.id] = true;
          }
        }

        // Convert object to pure javascript
        item = item.convertToDatabaseModel();

        console.log('dataService: createOne: item: ', item);
        option.ref.ref.add(item)
          .then((res) => {
            console.log('dataService: createOne success: res: ', res);
            resolve(res);
          }).catch((err) => {
            console.error('dataService: createOne: error: ', err);
            reject(err);
          });
      } else {
        console.log('dataService: createOne: wrong option! option: ', option);
        reject();
      }
    });

    return promise;
  }

  deleteOne(options: { item: any, ref: AngularFirestoreCollection<any> }) {
    const promise = new Promise((resolve, reject) => {

      if (options.item) {
        options.ref.doc(options.item.id)
          .delete()
          .then(() => {
            console.log('dataService: deleteOne success');
            resolve();
          }).catch((err) => {
            console.error('dataService: deleteOne: error: ', err);
            reject(err);
          });
      } else {
        console.log('dataService: deleteOne: wrong options! options: ', options);
        reject();
      }

    });

    return promise;
  }

  createMany(options: any[]) {
    console.log('dataService: createMany: options: ', options);
    const promise = new Promise((resolve, reject) => {
      // Create batch
      const batch = this.db.firestore.batch();

      if (options && options.length) {
        for (const option of options) {
          // Add data details
          option.item = this.addDataDetails(option.item, 'created');
          // Convert object to pure javascript
          option.item = option.item.convertToDatabaseModel();
          // Insert to batch
          batch.set(option.ref, option.item);
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

    });

    return promise;
  }

  deleteMany(options: any[]) {
    console.log('dataService: deleteMany: options: ', options);
    const promise = new Promise((resolve, reject) => {
      // Create batch
      const batch = this.db.firestore.batch();

      if (options && options.length) {
        for (const option of options) {
          // Insert to batch
          batch.delete(option.ref);
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

    });

    return promise;
  }

}
