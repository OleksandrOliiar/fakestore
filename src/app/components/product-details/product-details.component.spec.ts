import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ProductDetailsComponent } from './product-details.component';
import { ProductService, Product } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let activatedRoute: any;
  let router: Router;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'Test Description',
    category: 'Test Category',
    image: 'test.jpg',
    rating: { rate: 4.5, count: 10 }
  };

  beforeEach(async () => {
    // Create spies for services
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProduct']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart', 'openCart']);
    
    // Configure spy return values
    productServiceSpy.getProduct.and.returnValue(of(mockProduct));
    authServiceSpy.isLoggedIn.and.returnValue(true);

    // Mock activated route
    activatedRoute = {
      paramMap: of(convertToParamMap({ id: '1' }))
    };

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        ProductDetailsComponent
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product details on init', () => {
    expect(productServiceSpy.getProduct).toHaveBeenCalledWith(1);
    expect(component.product).toEqual(mockProduct);
    expect(component.loading).toBeFalse();
  });

  it('should handle product load error', () => {
    // Re-create the component with error response
    productServiceSpy.getProduct.and.returnValue(throwError(() => new Error('Failed to load')));
    
    // Create a new instance to trigger the ngOnInit with error
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(component.error).toBe('Failed to load product details');
    expect(component.loading).toBeFalse();
  });

  it('should handle missing product ID', () => {
    // Re-create the component with no ID parameter
    activatedRoute.paramMap = of(convertToParamMap({}));
    
    // Create a new instance to trigger the ngOnInit with no ID
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(component.error).toBe('Product ID not provided');
    expect(component.loading).toBeFalse();
  });

  it('should increment quantity', () => {
    component.quantity = 1;
    component.incrementQuantity();
    expect(component.quantity).toBe(2);
  });

  it('should decrement quantity', () => {
    component.quantity = 2;
    component.decrementQuantity();
    expect(component.quantity).toBe(1);
  });

  it('should not decrement quantity below 1', () => {
    component.quantity = 1;
    component.decrementQuantity();
    expect(component.quantity).toBe(1);
  });

  it('should add to cart', () => {
    component.product = mockProduct;
    component.quantity = 2;
    
    component.addToCart();
    
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(mockProduct, 2);
    expect(cartServiceSpy.openCart).toHaveBeenCalled();
  });

  it('should not add to cart if product is null', () => {
    component.product = null;
    component.quantity = 2;
    
    component.addToCart();
    
    expect(cartServiceSpy.addToCart).not.toHaveBeenCalled();
  });

  it('should not add to cart if quantity is 0', () => {
    component.product = mockProduct;
    component.quantity = 0;
    
    component.addToCart();
    
    expect(cartServiceSpy.addToCart).not.toHaveBeenCalled();
  });

  it('should navigate back', () => {
    spyOn(router, 'navigate');
    
    component.navigateBack();
    
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
}); 