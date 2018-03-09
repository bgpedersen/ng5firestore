import * as moment from 'moment';
import { DataModel } from './DataModel';
import { Relation, Relations } from './Relation';

// interface Foo {
//   prop: number;

//   a();
//   b(x: string);
// }

// export class Bar implements Foo {

// }

export class Activity implements DataModel {
  id?: string;
  title?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  relationData?: Relations;
  template?: any;
  databaseModel?: any;

  constructor(data?) {
    if (data) {
      Object.assign(this, data);
    }
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

  // convertToPureJS() {
  //   throw new Error("Method not implemented.");
  // }
  convertToDatabaseModel() {
    throw new Error("Method not implemented.");
  }

  convertToPureJS() {
    // Convert object to pure javascript
    const pureItem = Object.assign({}, this);
    pureItem.relationData.createdBy = Object.assign({}, pureItem.relationData.createdBy);
    pureItem.relationData.updatedBy = Object.assign({}, pureItem.relationData.updatedBy);
    return pureItem;
  }

  private multipleRelations(relations, keepRelationData) {
    const newRelations: Relation[] = [];

    for (const relation of relations) {
      newRelations.push(new Relation(relation, keepRelationData));
    }

    // for (let i = 0; i < relations.length; i++) {
    //   newRelations.push(new Relation(relations[i], keepRelationData));
    // }
    return newRelations;
  }

}

// TODO
// 8/3: Mikael: Hent Grupper med Aktivitetsreferencer. I stedet for at hente disse referencers data som en del af gruppe-kaldet, så skub dem ind i et Activitets array af observables.
// 8/3: Opret en standard dataModel som kan implements i alle classes og auto-udfylder members og funktions.
// 8/3: Opret en convertToDatabaseModel funktion som convertere objektet til database klart, og i samme action opretter et pure JS object.
// 9/3: Mikael: Prøv at oprette 2 grupper. Herefter opret 3 aktiviteter. Opdater grupperne således: Akt1 er delt til gruppe1, Akt2 er delt til gruppe1+gruppe2, Akt3 er delt til gruppe2. Herefter fetch de 2 grupper, og opret fetch activity collections som matcher id'er for gruppe1 og gruppe2. Hvor bliver dette cached?
