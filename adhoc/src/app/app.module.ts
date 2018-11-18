import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PreviewComponent } from './preview/preview.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConnectionComponent } from './connection/connection.component';
import { NgDragDropModule } from 'ng-drag-drop';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  MatTreeModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnectionsApiService } from './services/connections-api.service';
import { DomainComponent } from './domain/domain.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ReportComponent } from './report/report.component';
import { ReportsApiService } from './services/reports-api.service';
import { CrosstabComponent } from './crosstab/crosstab.component';
import { EchartComponent } from './echart/echart.component';
import { JoinDialogComponent } from './join-dialog/join-dialog.component';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { PreviewResolverService } from './preview/preview-resolver.service';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { JoinManualDialogComponent } from './join-manual-dialog/join-manual-dialog.component';

const routes: Routes = [
  { path: '', resolve: { vendors: PreviewResolverService }, component: PreviewComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PreviewComponent,
    ConnectionComponent,
    DomainComponent,
    ReportComponent,
    CrosstabComponent,
    EchartComponent,
    JoinDialogComponent,
    FilterDialogComponent,
    ErrorDialogComponent,
    JoinManualDialogComponent
  ],
  entryComponents: [
    JoinDialogComponent,
    JoinManualDialogComponent,
    FilterDialogComponent,
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    BrowserAnimationsModule,
    NgDragDropModule.forRoot(),
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule
  ],
  providers: [
    { provide: ConnectionsApiService, useClass: ConnectionsApiService },
    { provide: ReportsApiService, useClass: ReportsApiService }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
