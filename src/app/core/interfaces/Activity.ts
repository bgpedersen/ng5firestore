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
}

export class Activity implements ActivityInterface {
  'id'?: string;
  'title': string;
  'description'?: string;
  'timestamp'?: Date;
  'createdAt'?: Date;
  'updatedAt'?: Date;
  'relationData': ActivityRelations;
  'template'?: any;

  constructor(data: ActivityInterface = {}) {
    this.id = data.id ? data.id : null;
    this.title = data.title ? data.title : '';
    this.description = data.description ? data.description : '';
    this.relationData = {
      'updatedBy': { 'ref': data.relationData ? data.relationData.updatedBy.ref : null, 'data': null },
      'createdBy': { 'ref': data.relationData ? data.relationData.createdBy.ref : null, 'data': null }
    };
  }
}
