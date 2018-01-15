import { AuthService } from './shared/services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {

  // add the service we need
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.getUser().map(user => {
      console.log('AuthGuard: user: ', user);
      if (user) {
        return true;
      }
      return false;
    });

    // return this.angularFireAuth.authState.map(user => {
    //   console.log('AuthGuard: user: ', user);
    //   if (user) {
    //     return true;
    //   }
    //   return false;
    // });

    // if (this.authService.checkAuthStatus()) {
    //   console.log('authenticated');
    //   return true;
    // } else {
    //   console.log('not authenticated');
    //   this.router.navigateByUrl('/login');
    //   return false;
    // }

    // // handle any redirects if a user isn't authenticated
    // if (!this.authService.isLoggedIn()) {
    //   // redirect the user
    //   this.router.navigate(['/login']);
    //   return false;
    // }

    // return true;
  }

}

