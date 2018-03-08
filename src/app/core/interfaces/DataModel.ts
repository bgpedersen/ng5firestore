export interface DataModel {
  'id': string;
  'title': string;
  'description': string;
  'createdAt': Date;
  'updatedAt': Date;

  convertToPureJS();
}