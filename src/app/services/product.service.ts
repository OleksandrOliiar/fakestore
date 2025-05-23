import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export type SortOrder = 'asc' | 'desc';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com';

  constructor(private http: HttpClient) { }

  getAllProducts(sortOrder: SortOrder = 'asc'): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?sort=${sortOrder}`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/categories`);
  }

  getProductsByCategory(category: string, sortOrder: SortOrder = 'asc'): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/category/${category}?sort=${sortOrder}`);
  }
} 