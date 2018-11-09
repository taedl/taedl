import { TestBed } from '@angular/core/testing';

import { PreviewResolverService } from './preview-resolver.service';

describe('PreviewResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreviewResolverService = TestBed.get(PreviewResolverService);
    expect(service).toBeTruthy();
  });
});
