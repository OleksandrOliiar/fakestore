import { Component, ElementRef, HostListener, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from './services/search.service';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { CartSheetComponent } from './components/cart-sheet/cart-sheet.component';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterModule, CartSheetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'FakeStore';
  searchTerm: string = '';
  showSearchInput: boolean = false;
  cartItemCount: number = 0;
  private searchSubject = new Subject<string>();
  private cartCountSubscription: Subscription | null = null;
  
  @ViewChild('searchContainer') searchContainer: ElementRef | null = null;

  constructor(
    private searchService: SearchService,
    public router: Router,
    public authService: AuthService,
    public cartService: CartService
  ) {
    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(300), // 300ms delay
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchService.setSearchTerm(term);
      if (term && this.router.url !== '/' && this.router.url !== '/products') {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit(): void {
    // Subscribe to cart item count changes
    this.cartCountSubscription = this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  ngOnDestroy(): void {
    if (this.cartCountSubscription) {
      this.cartCountSubscription.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close search panel when clicking outside of it
    if (this.showSearchInput && this.searchContainer) {
      const target = event.target as HTMLElement;
      if (!this.searchContainer.nativeElement.contains(target)) {
        this.showSearchInput = false;
      }
    }
  }

  toggleSearchInput(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation(); // Prevent the click from immediately closing the search
    }
    this.showSearchInput = !this.showSearchInput;
    if (!this.showSearchInput) {
      this.searchTerm = '';
      this.searchService.setSearchTerm('');
    }
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  search(): void {
    this.searchService.setSearchTerm(this.searchTerm);
    if (this.router.url !== '/' && this.router.url !== '/products') {
      this.router.navigate(['/']);
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchService.setSearchTerm('');
  }
}
