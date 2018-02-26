import * as firebase from 'firebase';
import * as moment from 'moment';

export interface ActivityInterface {
  'id'?: string;
  'title'?: string;
  'description'?: string;
  // 'timestamp'?: any;
  'createdAt'?: any;
  // 'updatedAt'?: any;
  // 'template'?: any;
}

export class Activity implements ActivityInterface {
  'id'?: string;
  'title': string;
  'description': string;
  'timestamp': any;
  'createdAt': any;
  'updatedAt': any;
  'template'?: any;
  constructor(data: ActivityInterface = {}) {
    // const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    if (data && data.id) {
      this.id = data.id;
    }
    this.title = data.title ? data.title : '';
    this.description = data.description ? data.description : '';

    // this.timestamp = timestamp;
    // this.createdAt = data.createdAt ? data.createdAt : timestamp;
    // this.updatedAt = timestamp;
    this.timestamp = new Date();
    this.createdAt = data.createdAt ? data.createdAt : new Date();
    this.updatedAt = new Date();
  }
}
