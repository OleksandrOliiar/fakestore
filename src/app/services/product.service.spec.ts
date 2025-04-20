import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService, Product, SortOrder } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', () => {
    const dummyProducts: Product[] = [
      {
        id: 1,
        title: 'Test Product',
        price: 13.5,
        description: 'Test Description',
        category: 'Test Category',
        image: 'test.jpg',
        rating: { rate: 4.5, count: 10 }
      }
    ];

    service.getAllProducts().subscribe(products => {
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne('https://fakestoreapi.com/products?sort=asc');
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('should get a product by id', () => {
    const dummyProduct: Product = {
      id: 1,
      title: 'Test Product',
      price: 13.5,
      description: 'Test Description',
      category: 'Test Category',
      image: 'test.jpg',
      rating: { rate: 4.5, count: 10 }
    };

    service.getProduct(1).subscribe(product => {
      expect(product).toEqual(dummyProduct);
    });

    const req = httpMock.expectOne('https://fakestoreapi.com/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyProduct);
  });

  it('should get categories', () => {
    const dummyCategories: string[] = ['category1', 'category2', 'category3'];

    service.getCategories().subscribe(categories => {
      expect(categories).toEqual(dummyCategories);
    });

    const req = httpMock.expectOne('https://fakestoreapi.com/products/categories');
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategories);
  });

  it('should get products by category', () => {
    const dummyProducts: Product[] = [
      {
        id: 1,
        title: 'Test Product',
        price: 13.5,
        description: 'Test Description',
        category: 'electronics',
        image: 'test.jpg',
        rating: { rate: 4.5, count: 10 }
      }
    ];

    service.getProductsByCategory('electronics').subscribe(products => {
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne('https://fakestoreapi.com/products/category/electronics?sort=asc');
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('should get products with desc sort order', () => {
    const dummyProducts: Product[] = [
      {
        id: 1,
        title: 'Test Product',
        price: 13.5,
        description: 'Test Description',
        category: 'Test Category',
        image: 'test.jpg',
        rating: { rate: 4.5, count: 10 }
      }
    ];

    service.getAllProducts('desc').subscribe(products => {
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne('https://fakestoreapi.com/products?sort=desc');
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });
}); 