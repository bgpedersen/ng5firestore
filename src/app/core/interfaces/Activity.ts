import * as moment from 'moment';
import { Relation } from './Relation';

export interface ActivityRelations {
  'updatedBy': Relation
  'createdBy': Relation
}

export interface ActivityInterface {
  'id'?: string;
  'title'?: string;
  'description'?: string;
  'createdAt'?: Date;
  'updatedAt'?: Date;
  'relationData'?: ActivityRelations;
  // old migrate data
  'createdBy'?: any;
  'updatedBy'?: any;
}

export class Activity implements ActivityInterface {
  'id'?: string;
  'title': string;
  'description'?: string;
  'timestamp'?: Date;
  'createdAt': Date;
  'updatedAt': Date;
  'template'?: any;
  'relationData': ActivityRelations;
  [propName: string]: any;

  constructor(data: ActivityInterface = {}) {
    this.id = data.id ? data.id : null;
    this.title = data.title ? data.title : '';
    this.description = data.description ? data.description : '';
    this.createdAt = data.createdAt ? data.createdAt : new Date();
    this.updatedAt = data.updatedAt ? data.updatedAt : new Date();
    this.relationData = data.relationData ? data.relationData : {
      'updatedBy': { 'ref': null, 'data': null },
      'createdBy': { 'ref': null, 'data': null }
    };
    // Old migrate data
    if (data.createdBy) {
      this.relationData.createdBy.ref = data.createdBy;
    }
    if (data.updatedBy) {
      this.relationData.updatedBy.ref = data.updatedBy;
    }
  }
}
