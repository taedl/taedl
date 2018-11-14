import { TestBed } from '@angular/core/testing';

import { PreviewResolverService } from './preview-resolver.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConnectionsApiService } from '../services/connections-api.service';

describe('PreviewResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [ ConnectionsApiService ]
  }));

  it('should be created', () => {
    const service: PreviewResolverService = TestBed.get(PreviewResolverService);
    expect(service).toBeTruthy();
  });
});
