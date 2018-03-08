import * as moment from 'moment';
import { Relation } from './Relation';
import { DataModel } from './DataModel';

export class Activity implements DataModel {
  // 'id'?: string;
  // 'title': string;
  // 'description'?: string;
  // 'timestamp'?: Date;
  // 'createdAt'?: Date;
  // 'updatedAt'?: Date;
  // 'relationData': ActivityRelations;
  // 'template'?: any;


  constructor(data?, keepRelationData?: boolean) {
    if (data) {
      Object.assign(this, data);
    }
    //  else {

    // this.id = null;
    // this.title = '';
    // this.description = '';
    // this.relationData = {
    //   'createdBy': (data.relationData && data.relationData.createdBy) ? new Relation(data.relationData.createdBy, keepRelationData) : new Relation(),
    //   'updatedBy': (data.relationData && data.relationData.updatedBy) ? new Relation(data.relationData.updatedBy, keepRelationData) : new Relation(),
    //   'groups': (data.relationData && data.relationData.groups) ? this.multipleRelations(data.relationData.groups, keepRelationData) : []
    //   // 'updatedBy': { 'ref': data.relationData ? data.relationData.updatedBy.ref : null, 'data': null },
    //   // 'createdBy': { 'ref': data.relationData ? data.relationData.createdBy.ref : null, 'data': null }
    // };
  }

  multipleRelations(relations, keepRelationData) {
    var newRelations: Relation[] = [];
    for (let i = 0; i < relations.length; i++) {
      newRelations.push(new Relation(relations[i], keepRelationData));
    }
    return newRelations;
  }

  // convertToPureJS() {
  //   // Convert object to pure javascript
  //   let pureItem = Object.assign({}, this);
  //   pureItem.relationData.createdBy = Object.assign({}, pureItem.relationData.createdBy);
  //   pureItem.relationData.updatedBy = Object.assign({}, pureItem.relationData.updatedBy);
  //   return pureItem;
  // }

}
