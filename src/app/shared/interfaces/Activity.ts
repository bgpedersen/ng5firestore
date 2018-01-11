
// declare var Object: any;
export interface ActivityInterface {
  'id'?: string;
  'title': string;
  'description': string;
  'timestamp': Date;
}

export class Activity implements ActivityInterface {
  'id'?: string;
  'title': string;
  'description': string;
  'timestamp': Date;
  constructor(data?: ActivityInterface) {
    Object.assign(this, data);
  }
}

// export class Activity {
//   id?: string;
//   title: string;
//   description: string;
//   timestamp: Date;

//   constructor(
//     title: string,
//     description: string,
//     timestamp: Date
//   ) {
//     this.title = title;
//     this.description = description;
//     this.timestamp = timestamp;
//   }
// }
