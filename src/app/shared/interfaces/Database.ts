import { Activity } from './Activity';
import { Booking } from './Booking';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';


export interface DatabaseInterface {
  'Activities$': Observable<Activity[]>;
  'User$': Observable<any>;
  'ServerRefs': any;
}
