import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart-sheet.component.html',
  styleUrls: ['./cart-sheet.component.css']
})
export class CartSheetComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  isOpen = false;
  totalPrice = 0;
  
  private cartSubscription: Subscription | null = null;
  private cartOpenSubscription: Subscription | null = null;

  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    // Subscribe to cart items changes
    this.cartSubscription = this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
    });

    // Subscribe to cart open state
    this.cartOpenSubscription = this.cartService.getCartOpenState().subscribe(isOpen => {
      this.isOpen = isOpen;
      
      // Disable scrolling on body when cart is open
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.cartOpenSubscription) {
      this.cartOpenSubscription.unsubscribe();
    }
    
    // Ensure body scrolling is restored
    document.body.style.overflow = '';
  }

  // Listen for ESC key to close cart
  @HostListener('document:keydown.escape')
  closeCartOnEsc(): void {
    this.cartService.closeCart();
  }

  // Close cart when clicking on overlay
  closeCart(): void {
    this.cartService.closeCart();
  }

  // Prevent clicks inside cart from closing it
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  // Increment item quantity
  incrementQuantity(productId: number): void {
    this.cartService.incrementQuantity(productId);
  }

  // Decrement item quantity
  decrementQuantity(productId: number): void {
    this.cartService.decrementQuantity(productId);
  }

  // Update item quantity
  updateQuantity(productId: number, event: any): void {
    const quantity = parseInt(event.target.value);
    if (!isNaN(quantity) && quantity >= 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  // Remove item from cart
  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  // Clear cart
  clearCart(): void {
    this.cartService.clearCart();
  }
} 