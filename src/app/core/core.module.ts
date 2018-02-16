import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { AlertService } from './services/alert.service';
import { DataService } from './services/data.service';
import { AuthGuard } from './guard/auth.guard';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [AuthService, AlertService, DataService, AuthGuard]
})
export class CoreModule { }
