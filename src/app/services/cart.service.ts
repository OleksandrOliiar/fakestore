import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'fakestore_cart';
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private isCartOpenSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.loadCart();
  }

  // Load cart from localStorage
  private loadCart(): void {
    const savedCart = localStorage.getItem(this.cartKey);
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart);
        this.cartSubject.next([...this.cartItems]);
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
        this.cartItems = [];
        this.cartSubject.next([]);
      }
    }
  }

  // Save cart to localStorage
  private saveCart(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
    this.cartSubject.next([...this.cartItems]);
  }

  // Get cart items as observable
  getCartItems(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  // Get cart open state as observable
  getCartOpenState(): Observable<boolean> {
    return this.isCartOpenSubject.asObservable();
  }

  // Get cart item count
  getCartItemCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.getCartItems().subscribe(items => {
        const count = items.reduce((total, item) => total + item.quantity, 0);
        observer.next(count);
      });
    });
  }

  // Add item to cart
  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }
    
    this.saveCart();
  }

  // Update item quantity
  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart();
      }
    }
  }

  // Increment item quantity
  incrementQuantity(productId: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity += 1;
      this.saveCart();
    }
  }

  // Decrement item quantity
  decrementQuantity(productId: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart();
      }
    }
  }

  // Remove item from cart
  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.saveCart();
  }

  // Clear cart
  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
  }

  // Get total price
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  // Toggle cart visibility
  toggleCart(): void {
    this.isCartOpenSubject.next(!this.isCartOpenSubject.value);
  }

  // Open cart
  openCart(): void {
    this.isCartOpenSubject.next(true);
  }

  // Close cart
  closeCart(): void {
    this.isCartOpenSubject.next(false);
  }
} 