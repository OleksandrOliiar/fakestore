import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface CartData {
  id: number;
  userId: number;
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://fakestoreapi.com';

  constructor(private http: HttpClient) { }

  createCart(cartData: CartData): Observable<any> {
    return this.http.post(`${this.apiUrl}/carts`, cartData);
  }
} 