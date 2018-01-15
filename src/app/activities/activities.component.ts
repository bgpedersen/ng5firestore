import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Activity } from '../shared/interfaces/Activity';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  public activities = [];

  activitiesCollection: AngularFirestoreCollection<Activity>;
  activitiesDoc: AngularFirestoreDocument<Activity>;

  activitiesList: Observable<Activity[]>;

  activitiesListSnapshot: any;
  itemList: Activity[];
  editItem: Activity;

  count = 10;

  constructor(public db: AngularFirestore,
    public authService: AuthService) { }

  ngOnInit() {
    this.activitiesCollection = this.db.collection('activities', ref => {
      return ref.orderBy('timestamp', 'desc');
    });

    this.getActivities();
  }


  getActivities() {
    this.activitiesCollection
      .snapshotChanges()
      .map(arr => {
        // console.log('getActivities: arr: ', arr);
        return arr.map(snap => {
          const obj = snap.payload.doc.data() as Activity;
          obj.id = snap.payload.doc.id;

          // const source = snap.payload.doc.metadata.fromCache ? 'local cache' : 'server';
          // console.log('getActivities: Data came from ' + source);

          return obj;
        });
      })
      .subscribe(response => {
        console.log('getActivities: subscribe: response: ', response);
        this.itemList = response;
      });
  }



  getItem(id) {
    this.activitiesDoc = this.activitiesCollection.doc(id);
    this.activitiesDoc
      .snapshotChanges()
      .map(snap => {
        if (snap.payload.exists) {
          const obj = snap.payload.data() as Activity;
          obj.id = snap.payload.id;

          console.log('getItem: obj: ', obj);
          const source = snap.payload.metadata.fromCache ? 'local cache' : 'server';
          console.log('getItem: Data came from ' + source);

          return obj;
        }
      })
      .subscribe(response => {
        this.editItem = response ? response : null;
        console.log('getItem: this.editItem: ', this.editItem);
      });
  }

  updateItem() {
    this.activitiesDoc = this.db.doc('activities/' + this.editItem.id);
    this.activitiesDoc.update({
      title: this.editItem.title,
      description: this.editItem.description,
      timestamp: new Date()
    })
      .then(() => {

      })
      .catch(err => console.error('error: ', err.message));
  }


  createItem() {
    this.authService.getUser()
      .subscribe(user => {
        console.log('activitiesComponent: createItem: user: ', user);

        this.activitiesCollection.add(this.editItem)
          .then(res => {
            console.log('createItem: res:', res);
            this.getItem(res.id);
          })
          .catch(err => console.error('error: ', err.message));
      });
  }


  deleteItem() {
    this.activitiesDoc = this.db.doc('activities/' + this.editItem.id);
    this.activitiesDoc.delete()
      .then(res => {
        this.clearItem();
      })
      .catch(err => console.error('error: ', err.message));
  }

  clearItem() {
    this.editItem = null;
  }

  newItem() {
    this.editItem = new Activity();
    console.log('newItem: editItem: ', this.editItem);
  }

  createMany(count) {
    for (let i = 0; i < count; i++) {
      const obj = new Activity({
        title: 'Auto Created #' + i
      });
      this.activitiesCollection.add(obj)
        .then(result => console.log('createMany: result: ', result))
        .catch(err => console.error('error: ', err.message));
    }
  }

  deleteAll() {

  }

}
