import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Activity } from '../core/interfaces/Activity';
import { DatabaseInterface } from '../core/interfaces/Database';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../core/services/data.service';
import * as moment from 'moment';
import { AlertService } from '../core/services/alert.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, OnDestroy {

  refSubs = {
    'activitiesSub': null as Subscription
  };

  count = 10;

  editItem: Activity;
  activities: Activity[] = [];

  constructor(private dataService: DataService, private alertService: AlertService) { }

  ngOnInit() {
    console.log('ActivitiesComponent loaded');

    this.refSubs.activitiesSub = this.dataService.database.Activities$
      .subscribe(res => {
        this.activities = this.convertItems(res);
        console.log('ActivityComponent: this.activities: ', this.activities);
      });
  }

  ngOnDestroy() {
    this.clearRefSubs();
  }

  // Convert items are unique convertions of the items for this component
  convertItems(items) {
    for (let i = 0; i < items.length; i++) {
      items[i].template = {
        'listDate': moment(items[i].updatedAt).format('HH:mm - DD MMM YYYY')
      };
    }
    items = _.orderBy(items, 'updatedAt', 'desc');

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


  newItem() {
    this.editItem = new Activity();
    console.log('newItem: editItem: ', this.editItem);
  }

  getItem(id) {
    for (let i = 0; i < this.activities.length; i++) {
      if (this.activities[i].id === id) {
        this.editItem = this.activities[i];
        console.log('ActivitiesComponent: getItem: this.editItem: ', this.editItem);
      }
    }
  }

  updateItem(editItem) {
    const options = {
      item: new Activity(editItem),
      ref: this.dataService.serverRefs.ActivityRef
    }
    this.dataService.updateOne(options).then(() => {
      console.log('ActivitiesComponent: updateItem: success');
      this.alertService.createAlert({ 'type': 'success', 'message': 'Item updated' });
    }).catch(err => {
      console.log('ActivitiesComponent: updateItem: error: ', err);
      this.alertService.createAlert({ 'type': 'danger', 'message': 'Item update error! ' + err });
    });
  }

  createItem(editItem) {
    const options = {
      item: new Activity(editItem),
      ref: this.dataService.serverRefs.ActivityRef
    }
    this.dataService.createOne(options).then(() => {
      console.log('ActivitiesComponent: createItem: success');
      this.alertService.createAlert({ 'type': 'success', 'message': 'Item created' });
    }).catch(err => {
      console.log('ActivitiesComponent: createItem: error: ', err);
      this.alertService.createAlert({ 'type': 'danger', 'message': 'Item create error! ' + err });
    });
  }

  deleteItem(editItem) {
    const options = {
      item: new Activity(editItem),
      ref: this.dataService.serverRefs.ActivityRef
    }
    this.dataService.deleteOne(options).then(() => {
      console.log('ActivitiesComponent: deleteItem: success');
      this.alertService.createAlert({ 'type': 'success', 'message': 'Item deleted' });
      this.clearItem();
    }).catch(err => {
      console.log('ActivitiesComponent: deleteItem: error: ', err);
      this.alertService.createAlert({ 'type': 'danger', 'message': 'Item delete error! ' + err });
    });
  }

  createMany(count) {
    const items = [];

    for (let i = 0; i < count; i++) {
      const obj = {
        title: 'Auto title #' + i,
        description: 'Auto description #' + i,
      };
      const options = {
        item: new Activity(obj),
        ref: this.dataService.serverRefs.ActivityRef
      }
      items.push(options);
    }

    this.dataService.createMany({ 'items': items })
      .then(() => {
        console.log('ActivitiesComponent: createMany: success');
        this.alertService.createAlert({ 'type': 'success', 'message': 'Items created' });
      }, (err) => {
        console.log('ActivitiesComponent: createMany: error: ', err);
        this.alertService.createAlert({ 'type': 'danger', 'message': 'Items created error! ' + err });
      })
  }

  deleteAll() {
    const items = [];

    for (let i = 0; i < this.activities.length; i++) {
      const options = {
        item: new Activity(this.activities[i]),
        ref: this.dataService.serverRefs.ActivityRef
      }
      items.push(options);
    }

    this.dataService.deleteMany({ 'items': items })
      .then(() => {
        console.log('ActivitiesComponent: deleteMany: success');
        this.alertService.createAlert({ 'type': 'success', 'message': 'Items deleted' });
        this.clearItem();
      }, (err) => {
        console.log('ActivitiesComponent: deleteMany: error: ', err);
        this.alertService.createAlert({ 'type': 'danger', 'message': 'Items deleted error! ' + err });
      })
  }

  clearItem() {
    this.editItem = null;
  }




}
