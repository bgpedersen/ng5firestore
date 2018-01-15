import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Activity } from '../shared/interfaces/Activity';
import { DatabaseInterface } from '../shared/interfaces/Database';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../shared/services/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, OnDestroy {

  count = 10;

  databaseSub: Subscription;
  database: DatabaseInterface;

  editItem: Activity;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    console.log('ActivitiesComponent loaded');
    this.databaseSub = this.dataService.databaseObservable()
      .subscribe(database => {
        this.database = database;
        // Activity template
        for (let i = 0; i < this.database.Activities.length; i++) {
          this.database.Activities[i].template.listDate = moment(this.database.Activities[i].timestamp).format('HH:mm DDD MMM YYYY');
        }
        console.log('ActivitiesComponent: this.database: ', this.database);
      });
  }

  ngOnDestroy() {
    this.databaseSub.unsubscribe();
  }


  getItem(id) {
    for (let i = 0; i < this.database.Activities.length; i++) {
      if (this.database.Activities[i].id === id) {
        this.editItem = this.database.Activities[i];
        console.log('getItem: this.editItem: ', this.editItem);
      }
    }
    // this.activitiesDoc = this.activitiesCollection.doc(id);
    // this.activitiesDoc
    //   .snapshotChanges()
    //   .map(snap => {
    //     if (snap.payload.exists) {
    //       const obj = snap.payload.data() as Activity;
    //       obj.id = snap.payload.id;

    //       console.log('getItem: obj: ', obj);
    //       const source = snap.payload.metadata.fromCache ? 'local cache' : 'server';
    //       console.log('getItem: Data came from ' + source);

    //       return obj;
    //     }
    //   })
    //   .subscribe(response => {
    //     this.editItem = response ? response : null;
    //     console.log('getItem: this.editItem: ', this.editItem);
    //   });
  }

  updateItem() {
    // this.activitiesDoc = this.db.doc('activities/' + this.editItem.id);
    // this.activitiesDoc.update({
    //   title: this.editItem.title,
    //   description: this.editItem.description,
    //   timestamp: new Date()
    // })
    //   .then(() => {

    //   })
    //   .catch(err => console.error('error: ', err.message));
  }


  createItem() {
    // this.activitiesCollection.add(this.editItem)
    //   .then(res => {
    //     console.log('createItem: res:', res);
    //     this.getItem(res.id);
    //   })
    //   .catch(err => console.error('error: ', err.message));
  }


  deleteItem() {
    // this.activitiesDoc = this.db.doc('activities/' + this.editItem.id);
    // this.activitiesDoc.delete()
    //   .then(res => {
    //     this.clearItem();
    //   })
    //   .catch(err => console.error('error: ', err.message));
  }

  clearItem() {
    this.editItem = null;
  }

  newItem() {
    this.editItem = new Activity();
    console.log('newItem: editItem: ', this.editItem);
  }

  createMany(count) {
    // for (let i = 0; i < count; i++) {
    //   const obj = new Activity({
    //     title: 'Auto Created #' + i
    //   });
    //   this.activitiesCollection.add(obj)
    //     .then(result => console.log('createMany: result: ', result))
    //     .catch(err => console.error('error: ', err.message));
    // }
  }

  deleteAll() {

  }

}
