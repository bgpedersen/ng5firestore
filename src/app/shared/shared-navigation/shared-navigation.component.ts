import { DatabaseInterface } from '../interfaces/Database';
import { DataService } from '../services/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-shared-navigation',
  templateUrl: './shared-navigation.component.html',
  styleUrls: ['./shared-navigation.component.scss']
})
export class SharedNavigationComponent implements OnInit, OnDestroy {

  databaseSub: Subscription;
  database: DatabaseInterface;

  constructor(private authService: AuthService,
    private dataService: DataService) { }

  ngOnInit() {
    console.log('SharedNavigationComponent loaded');
    this.databaseSub = this.dataService.databaseObservable()
      .subscribe(database => {
        this.database = database;
        console.log('SharedNavigationComponent: this.database: ', this.database);
      });
  }

  ngOnDestroy() {
    this.databaseSub.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

}
