import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Activity } from './Activity';
import { User } from './User';
import { Group } from './Group';

export interface Database {
  '_User': BehaviorSubject<User>;
  '_Users': BehaviorSubject<User[]>;
  '_Groups': BehaviorSubject<Group[]>;
  '_Activities': BehaviorSubject<Activity[]>;
  '_ActivitiesByGroupId': BehaviorSubject<Activity[]>;
  // [x: string]: any;
}

export interface ObservableDatabase {
  'User$': Observable<User>;
  'Users$': Observable<User[]>;
  'Groups$': Observable<Group[]>;
  'Activities$': Observable<Activity[]>;
  'ActivitiesByGroupId$': Observable<Activity[]>;
  // [x: string]: any;
}
