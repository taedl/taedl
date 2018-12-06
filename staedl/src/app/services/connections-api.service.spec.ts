import { TestBed, inject } from '@angular/core/testing';

import { ConnectionsApiService } from './connections-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ConnectionsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectionsApiService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([ConnectionsApiService], (service: ConnectionsApiService, httpMock: HttpTestingController) => {
    expect(service).toBeTruthy();
  }));
});
