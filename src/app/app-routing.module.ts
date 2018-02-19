import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { ChatComponent } from './chat/chat.component';
import { ActivitiesComponent } from './activities/activities.component';
import { GroupsComponent } from './groups/groups.component';
import { AuthGuard } from './core/guard/auth.guard';
import { ProfileComponent } from './profile/profile.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'activities', component: ActivitiesComponent, canActivate: [AuthGuard] },
  { path: 'groups', component: GroupsComponent, canActivate: [AuthGuard] },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
