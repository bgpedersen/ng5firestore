import { Component, OnDestroy, OnInit } from '@angular/core';
import { DocumentReference } from '@firebase/firestore-types';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as _ from 'lodash';
import * as moment from 'moment';
import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operator/map';
import { Subscription } from 'rxjs/Subscription';
import { Activity } from '../core/interfaces/Activity';
import { AlertService } from '../core/services/alert.service';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, OnDestroy {

  refSubs = {
    activitiesSub: null as Subscription,
  };

  count = 10;

  editItem: Activity;
  activities: Activity[] = [];

  constructor(private dataService: DataService,
    private alertService: AlertService) { }

  ngOnInit() {
    console.log('ActivitiesComponent loaded');

    // this.refSubs.activitiesSub = this.dataService.observableDatabase.Activities$
    this.refSubs.activitiesSub = this.dataService.observableDatabase.ActivitiesByGroupId$
      .subscribe((res: Activity[]) => {
        console.log('ActivitiesComponent activities: res: ', res);
        this.activities = this.convertItems(res);
      });
  }

  ngOnDestroy() {
    this.clearRefSubs();
  }

  // Convert items are unique convertions of the items for this component
  convertItems(items) {
    for (const item of items) {
      item.template = {
        updatedAt: moment(item.updatedAt).format('HH:mm - DD MMM YYYY'),
        createdAt: moment(item.createdAt).format('HH:mm - DD MMM YYYY'),
      };
    }

    items = _.orderBy(items, ['updatedAt'], 'desc');

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
    for (const item of this.activities) {
      if (item.id === id) {
        this.editItem = new Activity(item);
        console.log('ActivitiesComponent: getItem: this.editItem: ', this.editItem);
      }
    }
  }

  updateItem(editItem) {
    const option = {
      item: editItem,
      ref: this.dataService.serverRefs.ActivityRef,
    }
    this.dataService.updateOne(option).then((res) => {
      console.log('ActivitiesComponent: updateItem: success: res: ', res);
      this.alertService.createAlert({ type: 'success', message: 'Item updated' });
    }).catch((err) => {
      console.log('ActivitiesComponent: updateItem: error: ', err);
      this.alertService.createAlert({ type: 'danger', message: 'Item update error! ' + err });
    });
  }

  createItem(editItem) {
    const option = {
      item: editItem,
      ref: this.dataService.serverRefs.ActivityRef,
      type: 'Activity',
    };

    this.dataService.createOne(option)
      .then((res: DocumentReference) => {
        console.log('ActivitiesComponent: createItem: success: res: ', res);
        this.alertService.createAlert({ type: 'success', message: 'Item created' });
        this.getItem(res.id);
      }).catch(err => {
        console.log('ActivitiesComponent: createItem: error: ', err);
        this.alertService.createAlert({ type: 'danger', message: 'Item create error! ' + err });
      });
  }

  deleteItem(editItem) {
    const option = {
      item: editItem,
      ref: this.dataService.serverRefs.ActivityRef,
    }
    this.dataService.deleteOne(option).then(() => {
      console.log('ActivitiesComponent: deleteItem: success');
      this.alertService.createAlert({ type: 'success', message: 'Item deleted' });
      this.clearItem();
    }).catch(err => {
      console.log('ActivitiesComponent: deleteItem: error: ', err);
      this.alertService.createAlert({ type: 'danger', message: 'Item delete error! ' + err });
    });
  }

  createMany(count) {
    const options = [];

    for (let i = 0; i < count; i++) {
      const obj = new Activity();
      obj.title = 'Auto title #' + i;
      obj.description = 'Auto description #' + i;
      const option = {
        item: obj,
        ref: this.dataService.serverRefs.ActivityRef.ref.doc(),
      };
      options.push(option);
    }

    this.dataService.createMany(options)
      .then(() => {
        console.log('ActivitiesComponent: createMany: success!');
        this.alertService.createAlert({ type: 'success', message: 'Items created' });
      }, (err) => {
        console.log('ActivitiesComponent: createMany: error: ', err);
        this.alertService.createAlert({ type: 'danger', message: 'Items created error! ' + err });
      })
  }

  deleteAll() {
    const options = [];

    for (const item of this.activities) {
      const option = {
        ref: this.dataService.serverRefs.ActivityRef.ref.doc(item.id),
      };
      options.push(option);
    }

    this.dataService.deleteMany(options)
      .then(() => {
        console.log('ActivitiesComponent: deleteMany: success');
        this.alertService.createAlert({ type: 'success', message: 'Items deleted' });
        this.clearItem();
      }, (err) => {
        console.log('ActivitiesComponent: deleteMany: error: ', err);
        this.alertService.createAlert({ type: 'danger', message: 'Items deleted error! ' + err });
      })
  }

  clearItem() {
    this.editItem = null;
  }

}
