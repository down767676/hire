import { TestBed } from '@angular/core/testing';

import { ParamServiceService } from './param-service.service';

describe('ParamServiceService', () => {
  let service: ParamServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParamServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
