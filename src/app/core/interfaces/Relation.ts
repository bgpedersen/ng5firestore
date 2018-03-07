import { DocumentReference } from "@firebase/firestore-types";

export interface RelationInterface {
  'ref'?: DocumentReference,
  'data'?: any
}

export class Relation implements RelationInterface {
  'ref': DocumentReference;
  'data': any;
  constructor(data: RelationInterface = {}, keepRelationData?: boolean) {
    this.ref = data.ref ? data.ref : null;

    if (data.data && keepRelationData) {
      this.data = data.data;
    } else {
      this.data = null
    }
  }

  // setReferences(data: any, type: string, relation: string) {
  //   let returnData;

  //   // Object relation
  //   if (type === 'object') {
  //     let relationData: Relation = { 'ref': null, 'data': null };

  //     if (data) {
  //       relationData.ref = data[relation].ref;
  //       returnData = relationData;
  //     } else {
  //       returnData = relationData;
  //     }
  //   }
  //   // Array relations
  //   if (type === 'array') {

  //     let relationDataArray: Relation[] = [];

  //     if (data) {
  //       for (let i = 0; i < data[relation].length; i++) {
  //         let relationData: Relation = { 'ref': data[relation][i].ref, 'data': null };
  //         relationDataArray.push(relationData);
  //       }
  //       returnData = relationDataArray;
  //     } else {
  //       returnData = relationDataArray;
  //     }
  //   }
  //   console.log('Group: setReferences: returnData: ', returnData);
  //   return returnData;
  // }

}


