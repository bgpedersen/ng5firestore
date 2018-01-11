import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit, OnDestroy {

  databaseSub: Subscription;
  database: any;

  constructor(private dataService: DataService) {

    this.databaseSub = dataService.getDatabase().subscribe(database => {
      this.database = database;
      console.log('BookingsComponent: this.database: ', this.database);
    });

  }

  ngOnInit() {
    console.log('BookingsComponent loaded');
  }

  ngOnDestroy() {
    this.databaseSub.unsubscribe();
  }

}
