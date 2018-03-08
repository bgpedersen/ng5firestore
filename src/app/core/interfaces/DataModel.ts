import { Relations } from "./Relation";

export interface DataModel {
  'id'?: string;
  'title'?: string;
  'description'?: string;
  'createdAt'?: Date;
  'updatedAt'?: Date;
  'relationData'?: Relations;
  'template'?: any;

  convertToPureJS();
}