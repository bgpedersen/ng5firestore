import { Activity } from './Activity';
import { Observable } from 'rxjs/Observable';
import { User } from './User';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface Database {
  '_User': BehaviorSubject<User>,
  '_Users': BehaviorSubject<User[]>;
  '_Activities': BehaviorSubject<Activity[]>;
  [x: string]: any;
}

export interface ObservableDatabase {
  'User$': Observable<User>,
  'Activities$': Observable<Activity[]>;
  'Users$': Observable<User[]>;
  [x: string]: any;
}
