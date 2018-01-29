import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { Subscription } from 'rxjs/Subscription';
import { DatabaseInterface } from '../shared/interfaces/Database';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit, OnDestroy {

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    console.log('BookingsComponent loaded');
  }

  ngOnDestroy() {
  }

}
