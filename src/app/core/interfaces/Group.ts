import * as _ from 'lodash';
import * as moment from 'moment';
import { DataModel } from './DataModel';
import { Relation, Relations } from './Relation';

export class Group implements DataModel {
  id?: string;
  title?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  relationData?: Relations;
  template?: any;

  constructor(data?) {
    if (data) {
      Object.assign(this, data);
    } else {
      this.id = null;
      this.title = '';
      this.description = '';
      this.relationData = {
        createdBy: new Relation(),
        updatedBy: new Relation(),
        activities: [],
        groups: [],
      };
    }
  }

  convertToDatabaseModel() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      relationData: {
        createdBy: this.addPureRelation(this.relationData.createdBy),
        updatedBy: this.addPureRelation(this.relationData.updatedBy),
        activities: this.addPureRelation(this.relationData.activities),
        groups: this.addPureRelation(this.relationData.groups),
      },
    };
  }

  addPureRelation(data) {
    if (_.isArray(data)) {
      const relationArray = [];
      for (const item of data) {
        relationArray.push({ ref: item.ref, data: null });
      }
      return relationArray;
    } else {
      return {
        ref: data.ref,
        data: null,
      };
    }
  }

}

// TODO
// 8/3: Mikael: Hent Grupper med Aktivitetsreferencer. I stedet for at hente disse referencers data som en del af gruppe-kaldet, så skub dem ind i et Activitets array af observables.
// 8/3: Opret en standard dataModel som kan implements i alle classes og auto-udfylder members og funktions.
// 8/3: Opret en convertToDatabaseModel funktion som convertere objektet til database klart, og i samme action opretter et pure JS object.
// 9/3: Mikael: Prøv at oprette 2 grupper. Herefter opret 3 aktiviteter. Opdater grupperne således: Akt1 er delt til gruppe1, Akt2 er delt til gruppe1+gruppe2, Akt3 er delt til gruppe2. Herefter fetch de 2 grupper, og opret fetch activity collections som matcher id'er for gruppe1 og gruppe2. Hvor bliver dette cached?
