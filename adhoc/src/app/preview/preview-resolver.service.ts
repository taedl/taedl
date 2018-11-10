import { Injectable } from '@angular/core';
import { ConnectionsApiService } from '../services/connections-api.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, EMPTY, throwError, of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreviewResolverService implements Resolve<string[]> {

  constructor(private connectionsApiService: ConnectionsApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string[]> {
    return this.connectionsApiService.vendors().pipe(
      retry(1),
      map(res => res),
      catchError(() => {
        return of([]);
      })
    );
  }
}
