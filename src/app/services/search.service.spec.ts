import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get search term', (done) => {
    const testTerm = 'test search term';
    
    // Subscribe first to catch the term
    service.getSearchTerm().subscribe(term => {
      if (term === testTerm) {
        expect(term).toBe(testTerm);
        done();
      }
    });
    
    // Then set the term
    service.setSearchTerm(testTerm);
  });

  it('should start with an empty search term', (done) => {
    service.getSearchTerm().subscribe(term => {
      expect(term).toBe('');
      done();
    });
  });

  it('should update the search term', (done) => {
    const firstTerm = 'first term';
    const secondTerm = 'second term';
    let termCount = 0;
    
    service.getSearchTerm().subscribe(term => {
      termCount++;
      
      if (termCount === 1) {
        // First emission should be empty string (initial value)
        expect(term).toBe('');
      } else if (termCount === 2) {
        expect(term).toBe(firstTerm);
      } else if (termCount === 3) {
        expect(term).toBe(secondTerm);
        done();
      }
    });
    
    service.setSearchTerm(firstTerm);
    service.setSearchTerm(secondTerm);
  });
}); 