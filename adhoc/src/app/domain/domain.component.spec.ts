import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainComponent } from './domain.component';
import { ConnectionsApiService } from '../services/connections-api.service';
import { MatListModule } from '@angular/material';
import { NgDragDropModule } from 'ng-drag-drop';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DomainComponent', () => {
  let component: DomainComponent;
  let fixture: ComponentFixture<DomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainComponent ],
      providers: [ ConnectionsApiService ],
      imports: [ MatListModule, NgDragDropModule.forRoot(), HttpClientTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
