import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { AppRoutingModule } from './routing/app-routing.module';
import { AlertService } from './services/alert.service';
import { DataService } from './services/data.service';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  declarations: [],
  providers: [AuthService, AlertService, DataService]
})
export class CoreModule { }
