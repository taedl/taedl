import { TestBed, inject } from '@angular/core/testing';

import { ConnectionsApiService } from './connections-api.service';

describe('ConnectionsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectionsApiService]
    });
  });

  it('should be created', inject([ConnectionsApiService], (service: ConnectionsApiService) => {
    expect(service).toBeTruthy();
  }));
});
