import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  
  constructor() { }
  
  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }
  
  getSearchTerm(): Observable<string> {
    return this.searchTermSubject.asObservable();
  }
} 