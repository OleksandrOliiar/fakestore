import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    // Create spy for AuthService
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        LoginComponent
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should mark form as invalid if empty', () => {
    component.loginForm.setValue({
      username: '',
      password: ''
    });
    
    expect(component.loginForm.valid).toBeFalse();
    expect(component.loginForm.get('username')?.errors?.['required']).toBeTrue();
    expect(component.loginForm.get('password')?.errors?.['required']).toBeTrue();
  });

  it('should validate username minimum length', () => {
    component.loginForm.setValue({
      username: 'ab', // Less than 3 characters
      password: 'password123'
    });
    
    expect(component.loginForm.valid).toBeFalse();
    expect(component.loginForm.get('username')?.errors?.['minlength']).toBeTruthy();
  });

  it('should validate password minimum length', () => {
    component.loginForm.setValue({
      username: 'validuser',
      password: '12345' // Less than 6 characters
    });
    
    expect(component.loginForm.valid).toBeFalse();
    expect(component.loginForm.get('password')?.errors?.['minlength']).toBeTruthy();
  });

  it('should set form as valid with correct inputs', () => {
    component.loginForm.setValue({
      username: 'validuser',
      password: 'password123'
    });
    
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should not call login service if form is invalid on submit', () => {
    // Leave form invalid
    component.loginForm.setValue({
      username: '',
      password: ''
    });
    
    component.onSubmit();
    
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call login service and navigate on successful login', () => {
    // Set up form with valid values
    component.loginForm.setValue({
      username: 'validuser',
      password: 'password123'
    });
    
    // Set up auth service to return success
    authServiceSpy.login.and.returnValue(of({ token: 'fake-jwt-token' }));
    
    // Spy on localStorage and router
    spyOn(localStorage, 'setItem');
    spyOn(router, 'navigate');
    
    component.onSubmit();
    
    // Check if login was called with correct params
    expect(authServiceSpy.login).toHaveBeenCalledWith({
      username: 'validuser',
      password: 'password123'
    });
    
    // Check if token was saved
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token');
    
    // Check if router navigated
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    
    // Check loading and error state
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('should handle login error', () => {
    // Set up form with valid values
    component.loginForm.setValue({
      username: 'validuser',
      password: 'password123'
    });
    
    // Set up auth service to return error
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Login failed')));
    
    // Spy on console.error
    spyOn(console, 'error');
    
    component.onSubmit();
    
    // Check if login was attempted
    expect(authServiceSpy.login).toHaveBeenCalled();
    
    // Check error handling
    expect(console.error).toHaveBeenCalledWith('Login error:', jasmine.any(Error));
    expect(component.error).toBe('Invalid username or password. Please try again.');
    expect(component.loading).toBeFalse();
  });
}); 