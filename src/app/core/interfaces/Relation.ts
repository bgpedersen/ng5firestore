import { DocumentReference } from "@firebase/firestore-types";

export interface Relation {
  'ref': DocumentReference,
  'data': any
}