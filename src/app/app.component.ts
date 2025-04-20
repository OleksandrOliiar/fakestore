import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from './services/search.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FakeStore';
  searchTerm: string = '';
  showSearchInput: boolean = false;
  private searchSubject = new Subject<string>();
  
  @ViewChild('searchContainer') searchContainer: ElementRef | null = null;

  constructor(
    private searchService: SearchService,
    private router: Router
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
