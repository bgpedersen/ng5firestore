import * as moment from 'moment';
import { Relation, RelationInterface } from './Relation';
import * as _ from 'lodash';

export interface GroupRelations {
  'updatedBy': Relation
  'createdBy': Relation
  'activities': Relation[]
}

export interface GroupInterface {
  'id'?: string;
  'title'?: string;
  'description'?: string;
  'createdAt'?: Date;
  'updatedAt'?: Date;
  'relationData'?: GroupRelations;
}

export class Group implements GroupInterface {
  'id'?: string;
  'title': string;
  'description'?: string;
  'timestamp'?: Date;
  'createdAt'?: Date;
  'updatedAt'?: Date;
  'relationData': GroupRelations;
  'template'?: any;

  constructor(data: GroupInterface = {}) {
    this.id = data.id ? data.id : null;
    this.title = data.title ? data.title : '';
    this.description = data.description ? data.description : '';
    this.relationData = {
      'createdBy': data.relationData ? new Relation(data.relationData.createdBy) : new Relation(),
      'updatedBy': data.relationData ? new Relation(data.relationData.updatedBy) : new Relation(),
      'activities': data.relationData ? this.multipleRelations(data.relationData.activities) : []
      // 'createdBy': { 'ref': data.relationData ? data.relationData.createdBy.ref : null, 'data': null },
      // 'updatedBy': { 'ref': data.relationData ? data.relationData.updatedBy.ref : null, 'data': null },

    };
  }

  multipleRelations(relations) {
    var newRelations = [];
    for (let i = 0; i < relations.length; i++) {
      newRelations.push(new Relation(relations[i]));
    }
    return newRelations;
  }





}


