import { Activity } from './Activity';
import { Booking } from './Booking';


export interface DatabaseInterface {
  'Activities': Activity[];
  'Bookings': Booking[];
}
