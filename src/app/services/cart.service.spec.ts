import { TestBed } from '@angular/core/testing';
import { CartService, CartItem } from './cart.service';
import { Product } from './product.service';

describe('CartService', () => {
  let service: CartService;
  let mockStorage: any = {};
  
  // Mock localStorage
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
    
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'Test Description',
    category: 'Test Category',
    image: 'test.jpg',
    rating: { rate: 4.5, count: 10 }
  };

  it('should add item to cart', () => {
    service.addToCart(mockProduct, 1);
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].product.id).toBe(1);
      expect(items[0].quantity).toBe(1);
    });
  });

  it('should update quantity when adding same product', () => {
    service.addToCart(mockProduct, 1);
    service.addToCart(mockProduct, 2);
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(3);
    });
  });

  it('should update item quantity', () => {
    service.addToCart(mockProduct, 1);
    service.updateQuantity(1, 5);
    
    service.getCartItems().subscribe(items => {
      expect(items[0].quantity).toBe(5);
    });
  });

  it('should remove item when updating quantity to zero', () => {
    service.addToCart(mockProduct, 1);
    service.updateQuantity(1, 0);
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should increment item quantity', () => {
    service.addToCart(mockProduct, 1);
    service.incrementQuantity(1);
    
    service.getCartItems().subscribe(items => {
      expect(items[0].quantity).toBe(2);
    });
  });

  it('should decrement item quantity', () => {
    service.addToCart(mockProduct, 2);
    service.decrementQuantity(1);
    
    service.getCartItems().subscribe(items => {
      expect(items[0].quantity).toBe(1);
    });
  });

  it('should remove item when decrementing to zero', () => {
    service.addToCart(mockProduct, 1);
    service.decrementQuantity(1);
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should remove item from cart', () => {
    service.addToCart(mockProduct, 1);
    service.removeFromCart(1);
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should clear cart', () => {
    service.addToCart(mockProduct, 1);
    service.clearCart();
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should calculate total price correctly', () => {
    service.addToCart(mockProduct, 2); // 2 items at $100 each
    
    const total = service.getTotalPrice();
    expect(total).toBe(200);
  });

  it('should toggle cart visibility', () => {
    let visibility = false;
    
    service.getCartOpenState().subscribe(state => {
      visibility = state;
    });
    
    service.toggleCart();
    expect(visibility).toBe(true);
    
    service.toggleCart();
    expect(visibility).toBe(false);
  });

  it('should open cart', () => {
    let visibility = false;
    
    service.getCartOpenState().subscribe(state => {
      visibility = state;
    });
    
    service.openCart();
    expect(visibility).toBe(true);
  });

  it('should close cart', () => {
    let visibility = true;
    
    service.openCart(); // Set it to true first
    service.getCartOpenState().subscribe(state => {
      visibility = state;
    });
    
    service.closeCart();
    expect(visibility).toBe(false);
  });

  it('should get cart item count', () => {
    service.addToCart(mockProduct, 2);
    
    service.getCartItemCount().subscribe(count => {
      expect(count).toBe(2);
    });
  });
}); 