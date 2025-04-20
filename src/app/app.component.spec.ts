import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CartSheetComponent } from './components/cart-sheet/cart-sheet.component';
import { SearchService } from './services/search.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let searchServiceSpy: jasmine.SpyObj<SearchService>;

  beforeEach(async () => {
    // Create spy for SearchService
    searchServiceSpy = jasmine.createSpyObj('SearchService', ['getSearchTerm', 'setSearchTerm']);
    searchServiceSpy.getSearchTerm.and.returnValue(of(''));

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        CartSheetComponent
      ],
      providers: [
        { provide: SearchService, useValue: searchServiceSpy }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'FakeStore' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('FakeStore');
  });

  it('should render the store name in the header', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.text-2xl.font-bold')?.textContent).toContain('FakeStore');
  });
});
