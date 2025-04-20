import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';

import { CartSheetComponent } from './cart-sheet.component';
import { CartService, CartItem } from '../../services/cart.service';
import { Product } from '../../services/product.service';

describe('CartSheetComponent', () => {
  let component: CartSheetComponent;
  let fixture: ComponentFixture<CartSheetComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let mockCartItems$: BehaviorSubject<CartItem[]>;
  let mockIsOpen$: BehaviorSubject<boolean>;
  
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'Test Description',
    category: 'Test Category',
    image: 'test.jpg',
    rating: { rate: 4.5, count: 10 }
  };
  
  const mockCartItems: CartItem[] = [
    { product: mockProduct, quantity: 2 }
  ];

  beforeEach(async () => {
    // Create mock observables
    mockCartItems$ = new BehaviorSubject<CartItem[]>(mockCartItems);
    mockIsOpen$ = new BehaviorSubject<boolean>(false);
    
    // Create spy for CartService
    cartServiceSpy = jasmine.createSpyObj('CartService', [
      'getCartItems', 'getCartOpenState', 'getTotalPrice', 
      'closeCart', 'incrementQuantity', 'decrementQuantity', 
      'updateQuantity', 'removeFromCart', 'clearCart'
    ]);
    
    // Configure spy return values
    cartServiceSpy.getCartItems.and.returnValue(mockCartItems$);
    cartServiceSpy.getCartOpenState.and.returnValue(mockIsOpen$);
    cartServiceSpy.getTotalPrice.and.returnValue(200); // 2 items at $100 each
    
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        CartSheetComponent
      ],
      providers: [
        { provide: CartService, useValue: cartServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart items on init', () => {
    expect(component.cartItems).toEqual(mockCartItems);
    expect(component.totalPrice).toBe(200);
  });

  it('should update body overflow when cart opens', () => {
    expect(document.body.style.overflow).toBe('');
    
    // Simulate cart opening
    mockIsOpen$.next(true);
    
    expect(document.body.style.overflow).toBe('hidden');
    expect(component.isOpen).toBeTrue();
  });

  it('should restore body overflow when cart closes', () => {
    // Simulate cart opening first
    mockIsOpen$.next(true);
    expect(document.body.style.overflow).toBe('hidden');
    
    // Then simulate closing
    mockIsOpen$.next(false);
    
    expect(document.body.style.overflow).toBe('');
    expect(component.isOpen).toBeFalse();
  });

  it('should restore body overflow on component destroy', () => {
    // Simulate cart opening
    mockIsOpen$.next(true);
    expect(document.body.style.overflow).toBe('hidden');
    
    // Simulate component destruction
    component.ngOnDestroy();
    
    expect(document.body.style.overflow).toBe('');
  });

  it('should close cart when ESC key is pressed', () => {
    component.closeCartOnEsc();
    
    expect(cartServiceSpy.closeCart).toHaveBeenCalled();
  });

  it('should close cart when overlay is clicked', () => {
    component.closeCart();
    
    expect(cartServiceSpy.closeCart).toHaveBeenCalled();
  });

  it('should stop propagation for clicks inside cart', () => {
    const event = jasmine.createSpyObj('Event', ['stopPropagation']);
    
    component.stopPropagation(event);
    
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should increment item quantity', () => {
    component.incrementQuantity(1);
    
    expect(cartServiceSpy.incrementQuantity).toHaveBeenCalledWith(1);
  });

  it('should decrement item quantity', () => {
    component.decrementQuantity(1);
    
    expect(cartServiceSpy.decrementQuantity).toHaveBeenCalledWith(1);
  });

  it('should update item quantity', () => {
    const event = { target: { value: '5' } };
    
    component.updateQuantity(1, event);
    
    expect(cartServiceSpy.updateQuantity).toHaveBeenCalledWith(1, 5);
  });

  it('should not update item quantity with invalid input', () => {
    const event = { target: { value: 'invalid' } };
    
    component.updateQuantity(1, event);
    
    expect(cartServiceSpy.updateQuantity).not.toHaveBeenCalled();
  });

  it('should remove item from cart', () => {
    component.removeItem(1);
    
    expect(cartServiceSpy.removeFromCart).toHaveBeenCalledWith(1);
  });

  it('should clear cart', () => {
    component.clearCart();
    
    expect(cartServiceSpy.clearCart).toHaveBeenCalled();
  });
}); 