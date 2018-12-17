import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewComponent } from './preview.component';
import { ConnectionComponent } from '../connection/connection.component';
import { DomainComponent } from '../domain/domain.component';
import {
  MatButtonToggleModule,
  MatCardModule, MatCheckboxModule, MatDialogModule, MatExpansionModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatListModule,
  MatOptionModule, MatPaginatorModule,
  MatSelectModule, MatTableModule,
  MatTabsModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgDragDropModule } from 'ng-drag-drop';
import { ReportComponent } from '../report/report.component';
import { EchartComponent } from '../echart/echart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { CrosstabComponent } from '../crosstab/crosstab.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ConnectionsApiService } from '../services/connections-api.service';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component';

describe('PreviewComponent', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;

  let routeStub;

  beforeEach(async(() => {

    routeStub = {
      data: of({ vendors: ['foo', 'bar', 'buzz']})
    };

    TestBed.configureTestingModule({
      declarations: [
        PreviewComponent,
        ConnectionComponent,
        DomainComponent,
        ReportComponent,
        CrosstabComponent,
        EchartComponent,
        ErrorDialogComponent,
        TermsAndConditionsComponent
      ],
      imports: [
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatTabsModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatToolbarModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatListModule,
        NgDragDropModule.forRoot(),
        NgxEchartsModule,
        MatExpansionModule,
        MatButtonToggleModule,
        MatTooltipModule,
        RouterTestingModule,
        MatDialogModule,
        MatCheckboxModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        ConnectionsApiService
      ]
    })
    .compileComponents();
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should resolve supported vendors', async(() => {
    expect(component.vendors).toEqual(['foo', 'bar', 'buzz']);
  }));
});
