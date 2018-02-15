import * as firebase from 'firebase';

export interface ActivityInterface {
  'id'?: string;
  'title'?: string;
  'description'?: string;
  'timestamp'?: any;
  'createdAt'?: any;
  'updatedAt'?: any;
  'template'?: any;
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
    if (data && data.id) {
      this.id = data.id;
    }
    this.title = data.title ? data.title : '';
    this.description = data.description ? data.description : '';
    this.timestamp = data.timestamp ? data.timestamp : firebase.database.ServerValue.TIMESTAMP;
    this.createdAt = this.timestamp = data.timestamp ? data.timestamp : firebase.firestore.FieldValue.serverTimestamp();
    this.updatedAt = this.timestamp = data.timestamp ? data.timestamp : firebase.database.ServerValue.TIMESTAMP;
  }
}
