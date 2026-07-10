import { TestBed } from '@angular/core/testing';
import { UserService } from './user-service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('userIdentification should return 1 by default', () => {
    expect(service.userIdentification()).toBe(1);
  });
});
