import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportComponent } from './report.component';
import {
  MatButtonToggleModule,
  MatDialogModule, MatDialogRef,
  MatExpansionModule,
  MatIconModule,
  MatMenuModule,
  MatPaginatorModule,
  MatTableModule,
  MatToolbarModule, MatTooltipModule
} from '@angular/material';
import { ReportsApiService } from '../services/reports-api.service';
import { NgDragDropModule } from 'ng-drag-drop';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxEchartsModule } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { CrosstabComponent } from '../crosstab/crosstab.component';
import { EchartComponent } from '../echart/echart.component';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportComponent, CrosstabComponent, EchartComponent ],
      imports: [
        MatToolbarModule,
        MatMenuModule,
        MatExpansionModule,
        NgDragDropModule.forRoot(),
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        NgxEchartsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatButtonToggleModule,
        MatTooltipModule,
        FormsModule
      ],
      providers: [
        ReportsApiService,
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => { }
          }
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
