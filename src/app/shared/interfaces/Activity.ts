export interface Activity {
  timestamp: Date;
  title: string;
  id?: string;
  description?: string;
  signups?: any;
  signupsCount?: number;
  updated?: string;
}

export class Activity {
  constructor(
    // public title: string
  ) {
    this.timestamp = new Date();
    this.title = '';
    this.description = '';
  }


};