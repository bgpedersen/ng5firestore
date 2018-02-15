import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Activity } from '../core/interfaces/Activity';
import { DatabaseInterface } from '../core/interfaces/Database';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../core/services/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, OnDestroy {

  refSubs = {
    'databaseSub': null as Subscription
  };

  count = 10;

  editItem: Activity;
  activities: Activity[];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    console.log('ActivitiesComponent loaded');

    // Init get all items
    this.getItems();

    // Update new activities on database update
    this.refSubs.databaseSub = this.dataService.databaseUpdate$.subscribe(res => {
      console.log('ActivityComponent: database updated! this.dataService.database: ', this.dataService.database);
      this.getItems();
    });
  }

  ngOnDestroy() {
    this.clearRefSubs();
  }

  getItems() {
    this.activities = this.convertItems(this.dataService.database.Activities);
    console.log('ActivityComponent: getItems: this.activities: ', this.activities);
  }

  // Convert items are unique convertions of the items for this component
  convertItems(items) {
    for (let i = 0; i < items.length; i++) {
      items[i].template = {
        'listDate': moment(items[i].timestamp).format('HH:mm DDD MMM YYYY')
      };
    }
    return items;
  }

  clearRefSubs() {
    for (const key in this.refSubs) {
      if (this.refSubs[key]) {
        this.refSubs[key].unsubscribe();
      }
    }
    console.log('ActivitiesComponent: clearRefSubs: this.refSubs: ', this.refSubs);
  }

  getItem(id) {
    for (let i = 0; i < this.activities.length; i++) {
      if (this.activities[i].id === id) {
        this.editItem = this.activities[i];
        console.log('ActivitiesComponent: getItem: this.editItem: ', this.editItem);
      }
    }
  }

  deleteAll() {
    console.log('ActivitiesComponent: deleteAll: this.activities: ', this.activities);
    this.dataService.deleteAll({ items: this.activities, ref: this.dataService.database.ServerRefs.ActivityRef });
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

  createOne() {
    console.log('ActivitiesComponent: createOne: this.editItem: ', this.editItem);
    this.dataService.createOne({ item: this.editItem, ref: this.dataService.database.ServerRefs.ActivityRef });
    this.clearItem();
  }

  createMany(count) {
    const items = [];

    for (let i = 0; i < count; i++) {
      const obj = new Activity({
        title: 'Auto title #' + i,
        description: 'Auto description #' + i,
      });
      items.push(obj);
    }

    console.log('ActivitiesComponent: createMany: items: ', items);
    this.dataService.createMany({ items: items, ref: this.dataService.database.ServerRefs.ActivityRef });
  }


}
