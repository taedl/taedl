import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregationDialogComponent } from './aggregation-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatRadioModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

describe('AggregationDialogComponent', () => {
  let component: AggregationDialogComponent;
  let fixture: ComponentFixture<AggregationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggregationDialogComponent ],
      imports: [ FormsModule, MatDialogModule,  MatRadioModule ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => { }
          }
        },
        {
          provide: MAT_DIALOG_DATA, useValue: {
            aggregation: 'COUNT'
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
