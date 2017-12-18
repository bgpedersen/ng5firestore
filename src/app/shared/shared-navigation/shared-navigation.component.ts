import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-shared-navigation',
  templateUrl: './shared-navigation.component.html',
  styleUrls: ['./shared-navigation.component.scss']
})
export class SharedNavigationComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }

}
