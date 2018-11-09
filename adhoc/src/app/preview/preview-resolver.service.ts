import { Injectable } from '@angular/core';
import { ConnectionsApiService } from '../services/connections-api.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreviewResolverService implements Resolve<string[]>{

  constructor(private connectionsApiService: ConnectionsApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string[]> {
    return this.connectionsApiService.vendors();
  }
}
