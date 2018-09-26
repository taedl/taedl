import { TestBed, inject } from '@angular/core/testing';

import { ReportsApiService } from './reports-api.service';

describe('ReportsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportsApiService]
    });
  });

  it('should be created', inject([ReportsApiService], (service: ReportsApiService) => {
    expect(service).toBeTruthy();
  }));
});
