import * as firebase from 'firebase';
import * as moment from 'moment';
import { DocumentReference } from '@firebase/firestore-types';
import { DataDetails } from './DataDetails';

export interface ActivityInterface {
  'id'?: string;
  'title'?: string;
  'description'?: string;
}

export class Activity implements ActivityInterface, DataDetails {
  'id'?: string;
  'title'?: string;
  'description'?: string;
  'timestamp'?: Date;
  'createdAt'?: Date;
  'updatedAt'?: Date;
  'updatedBy'?: DocumentReference;
  'createdBy'?: DocumentReference;
  'template'?: any;
  [propName: string]: any;

  constructor(data: ActivityInterface = {}) {
    if (data && data.id) {
      this.id = data.id;
    }
    this.title = data.title ? data.title : '';
    this.description = data.description ? data.description : '';
  }
}
