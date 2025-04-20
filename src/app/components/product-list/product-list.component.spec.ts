import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProductListComponent } from './product-list.component';
import { ProductService, Product } from '../../services/product.service';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let searchServiceSpy: jasmine.SpyObj<SearchService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Test Product 1',
      price: 100,
      description: 'Test Description 1',
      category: 'Test Category',
      image: 'test1.jpg',
      rating: { rate: 4.5, count: 10 }
    },
    {
      id: 2,
      title: 'Test Product 2',
      price: 200,
      description: 'Test Description 2',
      category: 'Test Category 2',
      image: 'test2.jpg',
      rating: { rate: 3.5, count: 5 }
    }
  ];

  const mockCategories: string[] = ['category1', 'category2'];

  beforeEach(async () => {
    // Create spies for the services
    productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getAllProducts', 'getProductsByCategory', 'getCategories'
    ]);
    searchServiceSpy = jasmine.createSpyObj('SearchService', ['getSearchTerm', 'setSearchTerm']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);

    // Configure the spy return values
    productServiceSpy.getAllProducts.and.returnValue(of(mockProducts));
    productServiceSpy.getProductsByCategory.and.returnValue(of(mockProducts));
    productServiceSpy.getCategories.and.returnValue(of(mockCategories));
    searchServiceSpy.getSearchTerm.and.returnValue(of(''));
    authServiceSpy.isLoggedIn.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ProductListComponent
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CartService, useValue: cartServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productServiceSpy.getAllProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should load categories on init', () => {
    expect(productServiceSpy.getCategories).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCategories);
  });

  it('should filter products when search term changes', () => {
    // Set up the search term to match one product
    searchServiceSpy.getSearchTerm.and.returnValue(of('Test Product 1'));
    component.ngOnInit();

    // Manually trigger the filtering
    component.searchTerm = 'Test Product 1';
    component.filterProducts();

    expect(component.products.length).toBe(1);
    expect(component.products[0].title).toBe('Test Product 1');
  });

  it('should select category and load products for that category', () => {
    // Reset the spy call count
    productServiceSpy.getProductsByCategory.calls.reset();
    
    component.selectCategory('category1');
    
    expect(component.selectedCategory).toBe('category1');
    expect(productServiceSpy.getProductsByCategory).toHaveBeenCalledWith('category1', 'asc');
  });

  it('should toggle sort order and reload products', () => {
    component.currentSortOrder = 'asc';
    
    // Reset the spy call count
    productServiceSpy.getAllProducts.calls.reset();
    
    component.toggleSortOrder();
    
    expect(component.currentSortOrder).toBe('desc');
    expect(productServiceSpy.getAllProducts).toHaveBeenCalledWith('desc');
  });

  it('should add product to cart', () => {
    component.addToCart(mockProducts[0]);
    
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(mockProducts[0], 1);
  });

  it('should get the correct sort icon based on sort order', () => {
    component.currentSortOrder = 'asc';
    expect(component.getSortIcon()).toBe('M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12');
    
    component.currentSortOrder = 'desc';
    expect(component.getSortIcon()).toBe('M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4');
  });

  it('should unsubscribe from search on destroy', () => {
    const unsubscribeSpy = spyOn(component['searchSubscription'] as any, 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
}); 