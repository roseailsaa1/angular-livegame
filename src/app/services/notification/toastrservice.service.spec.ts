import { TestBed } from '@angular/core/testing';

import { ToastrserviceService } from './toastrservice.service';

describe('ToastrserviceService', () => {
  let service: ToastrserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastrserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
