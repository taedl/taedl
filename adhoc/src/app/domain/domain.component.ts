import { Component, OnInit } from '@angular/core';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  dummy1() {
    return this.stateService.isConnected();
  }

  dummy2() {
    return this.stateService.getConnection();
  }

}
