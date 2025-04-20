import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockStorage: any = {};

  beforeEach(() => {
    // Mock localStorage
    mockStorage = {};
    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key in mockStorage ? mockStorage[key] : null
    );
    spyOn(localStorage, 'setItem').and.callFake(
      (key, value) => (mockStorage[key] = value)
    );
    spyOn(localStorage, 'removeItem').and.callFake((key) => delete mockStorage[key]);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const credentials = { username: 'testuser', password: 'password123' };
    const mockResponse = { token: 'fake-jwt-token' };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://fakestoreapi.com/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);
  });

  it('should logout and remove token', () => {
    // Set a token first
    localStorage.setItem('token', 'fake-jwt-token');
    expect(localStorage.getItem('token')).toBe('fake-jwt-token');
    
    service.logout();
    
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should check if user is logged in when token exists', () => {
    localStorage.setItem('token', 'fake-jwt-token');
    
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should check if user is not logged in when no token exists', () => {
    localStorage.removeItem('token');
    
    expect(service.isLoggedIn()).toBeFalse();
  });
}); 