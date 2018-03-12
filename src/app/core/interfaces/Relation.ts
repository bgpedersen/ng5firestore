import { DocumentReference } from "@firebase/firestore-types";

export interface Relations {
  updatedBy?: Relation;
  createdBy?: Relation;
  groups?: Relation[];
  activities?: Relation[];
}

export class Relation {
  ref: DocumentReference;
  data: any;
  constructor(data?) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
