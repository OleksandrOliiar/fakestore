import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product, SortOrder } from '../../services/product.service';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  currentSortOrder: SortOrder = 'asc';
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  private searchSubscription: Subscription | null = null;
  private allProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    public searchService: SearchService,
    public authService: AuthService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    
    // Subscribe to search term changes
    this.searchSubscription = this.searchService.getSearchTerm().subscribe(term => {
      this.searchTerm = term;
      this.filterProducts();
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadProducts(category: string | null = null): void {
    this.loading = true;
    
    if (category) {
      this.productService.getProductsByCategory(category, this.currentSortOrder).subscribe({
        next: (data) => {
          this.allProducts = data;
          this.filterProducts();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load products';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.productService.getAllProducts(this.currentSortOrder).subscribe({
        next: (data) => {
          this.allProducts = data;
          this.filterProducts();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load products';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  selectCategory(category: string | null): void {
    this.selectedCategory = category;
    this.loadProducts(category);
  }

  toggleSortOrder(): void {
    this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    this.loadProducts(this.selectedCategory);
  }

  getSortIcon(): string {
    return this.currentSortOrder === 'asc' 
      ? 'M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12'  // Arrow up icon
      : 'M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4'; // Arrow down icon
  }

  filterProducts(): void {
    if (!this.searchTerm) {
      this.products = [...this.allProducts];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.products = this.allProducts.filter(product => 
      product.title.toLowerCase().includes(searchTermLower) || 
      product.description.toLowerCase().includes(searchTermLower) ||
      product.category.toLowerCase().includes(searchTermLower)
    );
  }

  // Add to cart method
  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    // Optionally show a notification or open the cart
  }
} 