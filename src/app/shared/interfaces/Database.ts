import { Activity } from './Activity';
import { Booking } from './Booking';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { AngularFirestoreCollection } from 'angularfire2/firestore';


export interface DatabaseInterface {
  'Activities': Activity[];
  'User$': Observable<any>;
  'ServerRefs': {
    'ActivityRef': AngularFirestoreCollection<Activity>
  };
  'ServerSubs': any;
}
