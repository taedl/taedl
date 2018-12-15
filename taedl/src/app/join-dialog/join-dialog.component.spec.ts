import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinDialogComponent } from './join-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatRadioButton, MatRadioModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

describe('JoinDialogComponent', () => {
  let component: JoinDialogComponent;
  let fixture: ComponentFixture<JoinDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinDialogComponent ],
      imports: [ FormsModule, MatDialogModule,  MatRadioModule ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => { }
          }
        },
        { provide: MAT_DIALOG_DATA, useValue: {
            primaryKey: {
              tableName: 'foo',
              name: 'bar'
            },
            foreignKey: {
              tableName: 'buzz',
              name: 'buzz'
            },
            type: 'foobarbuzz'
          }}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
