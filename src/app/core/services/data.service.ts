import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Activity } from '../interfaces/Activity';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DatabaseInterface } from '../interfaces/Database';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { User } from '../interfaces/User';
import { AuthService } from './auth.service';


@Injectable()
export class DataService {

  serverRefs = {
    'ActivityRef': this.db.collection<Activity>('activities'),
    'UserRef': this.db.collection<User>('users')
  }

  public database: DatabaseInterface = {
    'User$': this.authService.getUser(),
    'Activities$': this.fetchActivities(),
    'Users$': this.fetchUsers()
  };

  constructor(public db: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private authService: AuthService) {
  }

  fetchActivities() {
    return this.serverRefs.ActivityRef
      .snapshotChanges()
      .map(arr => {
        return arr.map(snap => {
          console.log('dataService: fetchActivities: map snap: ', snap);
          const obj = snap.payload.doc.data() as Activity;
          obj.id = snap.payload.doc.id;
          return obj;
        });
      })
  }

  fetchUsers() {
    return this.serverRefs.UserRef
      .snapshotChanges()
      .map(arr => {
        return arr.map(snap => {
          console.log('dataService: fetchUsers: map snap: ', snap);
          const obj = snap.payload.doc.data() as User;
          return obj;
        });
      })
  }

  updateOne(options: { item: any, ref: AngularFirestoreCollection<any> }) {
    const promise = new Promise((resolve, reject) => {

      if (options.item) {
        // Convert object to pure javascript
        const item = Object.assign({}, options.item);
        console.log('dataService: updateOne: update item: ', item);
        options.ref.doc(item.id)
          .update(item)
          .then(() => {
            console.log('dataService: updateOne success');
            resolve();
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
        // Convert object to pure javascript
        const item = Object.assign({}, options.item);
        console.log('dataService: createOne: set item: ', item);
        options.ref.add(item)
          .then(() => {
            console.log('dataService: createOne success');
            resolve();
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
        forkJoin(promises).subscribe(() => {
          console.log('dataService: createMany: forkJoin done');
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
}
