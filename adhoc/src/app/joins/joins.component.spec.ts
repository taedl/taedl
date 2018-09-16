import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinsComponent } from './joins.component';

describe('JoinsComponent', () => {
  let component: JoinsComponent;
  let fixture: ComponentFixture<JoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
