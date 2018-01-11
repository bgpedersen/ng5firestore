import { Activity } from '../interfaces/Activity';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DataService {

  private database: any = {
    'Activities': [],
    'Bookings': [],
    'Employees': []
  };
  private database$ = new Subject<any>();

  activitiesCollection: AngularFirestoreCollection<Activity>;
  activitiesDoc: AngularFirestoreDocument<Activity>;

  constructor(public db: AngularFirestore,
    public authService: AuthService) {

    console.log('dataService init');
    this.setupReferences();
    this.initServerState();
  }

  // Client Database
  sendDatabase(database: any) {
    this.database$.next(database);
  }

  getDatabase(): Observable<any> {
    return this.database$.asObservable();
  }

  // Setup & Init
  setupReferences() {
    this.activitiesCollection = this.db.collection('activities');
  }

  initServerState() {
    this.fetchActivities();
  }

  // Connections
  fetchActivities() {
    console.log('dataService: fetchActivities: called');
    this.activitiesCollection
      .snapshotChanges()
      .map(arr => {
        return arr.map(snap => {
          const obj = snap.payload.doc.data() as Activity;
          obj.id = snap.payload.doc.id;
          return obj;
        });
      })
      .subscribe(response => {
        console.log('dataService: fetchActivities: subscribe: response: ', response);
        for (let i = 0; i < response.length; i++) {
          response[i].title = "I changed the title of all";
        }
        this.database.Activities = response;
        this.sendDatabase(this.database);
      });
  }

}
