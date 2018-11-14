import { TestBed, inject } from '@angular/core/testing';

import { ReportsApiService } from './reports-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReportsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ReportsApiService ]
    });
  });

  it('should be created', inject([ReportsApiService], (service: ReportsApiService) => {
    expect(service).toBeTruthy();
  }));
});
