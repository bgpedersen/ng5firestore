import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Group } from '../core/interfaces/Group';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../core/services/data.service';
import * as moment from 'moment';
import { AlertService } from '../core/services/alert.service';
import * as _ from 'lodash';
import { DocumentReference } from '@firebase/firestore-types';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operator/map';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit, OnDestroy {

  refSubs = {
    'groupsSub': null as Subscription
  };

  count = 10;

  editItem: Group;
  groups: Group[] = [];


  constructor(private dataService: DataService,
    private alertService: AlertService) { }

  ngOnInit() {
    console.log('GroupsComponent loaded');

    this.refSubs.groupsSub = this.dataService.observableDatabase.Groups$
      .subscribe((res: Group[]) => {
        this.groups = this.convertItems(res);
      });
  }

  ngOnDestroy() {
    this.clearRefSubs();
  }

  // Convert items are unique convertions of the items for this component
  convertItems(items) {
    for (let i = 0; i < items.length; i++) {
      items[i].template = {
        'updatedAt': moment(items[i].updatedAt).format('HH:mm - DD MMM YYYY'),
        'createdAt': moment(items[i].createdAt).format('HH:mm - DD MMM YYYY')
      }
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
    console.log('GroupsComponent: clearRefSubs: this.refSubs: ', this.refSubs);
  }

  newItem() {
    this.editItem = new Group();
    console.log('newItem: editItem: ', this.editItem);
  }

  getItem(id) {
    for (let i = 0; i < this.groups.length; i++) {
      if (this.groups[i].id === id) {
        this.editItem = new Group(this.groups[i]);
        console.log('GroupsComponent: getItem: this.editItem: ', this.editItem);
      }
    }
  }

  updateItem(editItem) {
    const options = {
      item: new Group(editItem),
      ref: this.dataService.serverRefs.GroupRef
    }
    this.dataService.updateOne(options).then((res) => {
      console.log('GroupsComponent: updateItem: success: res: ', res);
      this.alertService.createAlert({ 'type': 'success', 'message': 'Item updated' });
    }).catch(err => {
      console.log('GroupsComponent: updateItem: error: ', err);
      this.alertService.createAlert({ 'type': 'danger', 'message': 'Item update error! ' + err });
    });
  }

  createItem(editItem) {
    const options = {
      item: new Group(editItem),
      ref: this.dataService.serverRefs.GroupRef
    }
    this.dataService.createOne(options).then((res: DocumentReference) => {
      console.log('GroupsComponent: createItem: success: res: ', res);
      this.alertService.createAlert({ 'type': 'success', 'message': 'Item created' });
      this.getItem(res.id);
    }).catch(err => {
      console.log('GroupsComponent: createItem: error: ', err);
      this.alertService.createAlert({ 'type': 'danger', 'message': 'Item create error! ' + err });
    });
  }

  deleteItem(editItem) {
    const options = {
      item: new Group(editItem),
      ref: this.dataService.serverRefs.GroupRef
    }
    this.dataService.deleteOne(options).then(() => {
      console.log('GroupsComponent: deleteItem: success');
      this.alertService.createAlert({ 'type': 'success', 'message': 'Item deleted' });
      this.clearItem();
    }).catch(err => {
      console.log('GroupsComponent: deleteItem: error: ', err);
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
        item: new Group(obj),
        ref: this.dataService.serverRefs.GroupRef.ref.doc()
      }
      items.push(options);
    }

    this.dataService.createMany({ 'items': items })
      .then(() => {
        console.log('GroupsComponent: createMany: success!');
        this.alertService.createAlert({ 'type': 'success', 'message': 'Items created' });
      }, (err) => {
        console.log('GroupsComponent: createMany: error: ', err);
        this.alertService.createAlert({ 'type': 'danger', 'message': 'Items created error! ' + err });
      })
  }

  deleteAll() {
    const items = [];

    for (let i = 0; i < this.groups.length; i++) {
      const options = {
        ref: this.dataService.serverRefs.GroupRef.ref.doc(this.groups[i].id)
      }
      items.push(options);
    }

    this.dataService.deleteMany({ 'items': items })
      .then(() => {
        console.log('GroupsComponent: deleteMany: success');
        this.alertService.createAlert({ 'type': 'success', 'message': 'Items deleted' });
        this.clearItem();
      }, (err) => {
        console.log('GroupsComponent: deleteMany: error: ', err);
        this.alertService.createAlert({ 'type': 'danger', 'message': 'Items deleted error! ' + err });
      })
  }

  clearItem() {
    this.editItem = null;
  }




}
