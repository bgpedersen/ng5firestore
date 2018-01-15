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
    this.id = data.id ? data.id : null;
    this.title = data.title ? data.title : '';
    this.description = data.description ? data.description : '';
    this.timestamp = data.timestamp ? data.timestamp : firebase.database.ServerValue.TIMESTAMP;
    this.createdAt = this.timestamp = data.timestamp ? data.timestamp : firebase.database.ServerValue.TIMESTAMP;
    this.updatedAt = this.timestamp = data.timestamp ? data.timestamp : firebase.database.ServerValue.TIMESTAMP;
    this.template = data.template ? data.template : null;
  }
}
