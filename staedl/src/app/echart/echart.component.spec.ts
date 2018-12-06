import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartComponent } from './echart.component';
import { NgxEchartsModule } from 'ngx-echarts';

describe('EchartComponent', () => {
  let component: EchartComponent;
  let fixture: ComponentFixture<EchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchartComponent ],
      imports: [ NgxEchartsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
