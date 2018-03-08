import { DocumentReference } from "@firebase/firestore-types";

export interface Relations {
  'updatedBy'?: Relation,
  'createdBy'?: Relation,
  'groups'?: Relation[],
  'activities'?: Relation[]
}

export class Relation {
  'ref': DocumentReference;
  'data': any;
  constructor(data?, keepRelationData?: boolean) {
    this.ref = data.ref ? data.ref : null;

    if (data.data && keepRelationData) {
      this.data = data.data;
    } else {
      this.data = null
    }
  }

}


