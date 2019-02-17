import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainComponent } from './domain.component';
import { ConnectionsApiService } from '../services/connections-api.service';
import {
  MatDialogModule,
  MatDialogRef,
  MatIconModule,
  MatListModule,
  MatPaginatorModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxEchartsModule } from 'ngx-echarts';
import { DragDropModule } from '@angular/cdk/drag-drop';

describe('DomainComponent', () => {
  let component: DomainComponent;
  let fixture: ComponentFixture<DomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainComponent ],
      providers: [
        ConnectionsApiService,
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => { }
          }
        },
      ],
      imports: [
        MatListModule,
        MatToolbarModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        NgxEchartsModule,
        HttpClientTestingModule,
        MatDialogModule,
        DragDropModule
      ]
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
