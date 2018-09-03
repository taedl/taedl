import { Component, OnInit } from '@angular/core';
import { ConnectionsApiService } from '../services/connections-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  vendors: string[];

  constructor(private connectionsApiService: ConnectionsApiService) { }

  ngOnInit() {
    this.connectionsApiService.getVendors()
      .subscribe(vendors => this.vendors = vendors);
  }
}
