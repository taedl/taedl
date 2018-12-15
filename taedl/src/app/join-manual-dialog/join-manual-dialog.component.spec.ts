import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinManualDialogComponent } from './join-manual-dialog.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatOptionModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('JoinManualDialogComponent', () => {
  let component: JoinManualDialogComponent;
  let fixture: ComponentFixture<JoinManualDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinManualDialogComponent ],
      imports: [ FormsModule, MatDialogModule, MatRadioModule, MatFormFieldModule,
        MatOptionModule, MatSelectModule, BrowserAnimationsModule ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => { }
          }
        },
        { provide: MAT_DIALOG_DATA, useValue: [{name: 'foo', columns: []}, {name: 'foo', columns: []}]}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinManualDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
