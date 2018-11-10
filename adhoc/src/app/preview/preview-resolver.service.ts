import { Injectable } from '@angular/core';
import { ConnectionsApiService } from '../services/connections-api.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Error } from 'tslint/lib/error';

@Injectable({
  providedIn: 'root'
})
export class PreviewResolverService implements Resolve<string[]>{

  constructor(private connectionsApiService: ConnectionsApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string[]> {
    return this.connectionsApiService.vendors().pipe(
      map(res => {
        console.log('result is: ', res);
        if (!res) {
          throw new Error('Value expected!');
        }
        return res;
      }),
      catchError(err => {
        console.log('caught error', err);
        return of([]);
      })
    );
    // return this.connectionsApiService.vendors().pipe(
    //   catchError(err => {
    //     console.log('could not resolve vendors');
    //     return EMPTY;
    //   }));
  }
}
