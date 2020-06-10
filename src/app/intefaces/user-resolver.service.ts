import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { empty } from 'rxjs';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<any>  {

  constructor(private fakeApi: UsersService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.fakeApi.getUsers().pipe(
      catchError((error) => {
        return empty();
      })
    );
  }
}
