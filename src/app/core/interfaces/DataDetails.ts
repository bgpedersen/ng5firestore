import { DocumentReference } from "@firebase/firestore-types";

export interface DataDetails {
  'timestamp'?: Date;
  'createdAt'?: Date;
  'updatedAt'?: Date;
  'updatedBy'?: DocumentReference;
  'createdBy'?: DocumentReference;
}