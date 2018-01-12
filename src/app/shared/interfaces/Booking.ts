
export interface BookingInterface {
  'id'?: string;
  'title'?: string;
  'description'?: string;
  'timestamp'?: Date;
  'createdAt'?: Date;
  'updatedAt'?: Date;
  'template'?: any;
}

export class Booking implements BookingInterface {
  'id'?: string;
  'title': string;
  'description': string;
  'timestamp': Date;
  'createdAt': Date;
  'updatedAt': Date;
  'template': any;
  constructor(data: BookingInterface = {}) {
    this.id = data.id ? data.id : null;
    this.title = data.title ? data.title : '';
    this.description = data.description ? data.description : '';
    this.timestamp = data.timestamp ? data.timestamp : new Date();
    this.createdAt = data.createdAt ? data.createdAt : new Date();
    this.updatedAt = data.updatedAt ? data.updatedAt : new Date();
    this.template = data.template ? data.template : {};
  }
}
