import { Activity } from './Activity';
import { Booking } from './Booking';
import * as firebase from 'firebase/app';


export interface DatabaseInterface {
  'Activities': Activity[];
  'Bookings': Booking[];
  'User': firebase.User;
}
