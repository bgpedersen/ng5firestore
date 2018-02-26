import { Activity } from './Activity';
import { Observable } from 'rxjs/Observable';
import { User } from './User';

export interface DatabaseInterface {
  'User$': Observable<User>,
  'Activities$': Observable<Activity[]>;
  'Users$': Observable<User[]>;
}
