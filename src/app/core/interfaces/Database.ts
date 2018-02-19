import { Activity } from './Activity';
import { Booking } from './Booking';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { User } from './User';


export interface DatabaseInterface {
  'User': User,
  'Activities': Activity[];
  'Users': User[];
  'ServerRefs': {
    'ActivityRef': AngularFirestoreCollection<Activity>
    'UserRef': AngularFirestoreCollection<User>
  };
  'ServerSubs': any;
}
