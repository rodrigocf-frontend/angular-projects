import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService, Pagination, FiltersApiResponse } from './products.service';
import { environment } from '../../../../environments/environment';
import { MOCK_PRODUCT } from '../../../../mocks/models/product.mock';
import {
  CategoryFilter,
  ColorFilter,
  PriceFilter,
  SizeFilter,
  SortFilter,
} from '../../../pages/products/store/products/products.reducers';
import { Product } from '../../../shared/models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getProducts', () => {
    it('should request the default page/perPage with no filter params when called with no args', () => {
      const response: Pagination<Product> = {
        first: 0,
        prev: 0,
        next: 0,
        last: 0,
        pages: 1,
        items: 0,
        data: [],
      };

      let result: Pagination<Product> | undefined;
      service.getProducts({}).subscribe((res) => (result = res));

      const req = httpMock.expectOne(
        (r) => r.url === `${environment.apiUrl}/products?_page=0&_per_page=9` && r.method === 'GET',
      );
      expect(req.request.params.keys().length).toBe(0);
      req.flush(response);
      expect(result).toEqual(response);
    });

    it('should append _page and _per_page as literal query segments in the URL', () => {
      service.getProducts({ page: 2, perPage: 12 }).subscribe();
      const req = httpMock.expectOne(
        (r) =>
          r.url === `${environment.apiUrl}/products?_page=2&_per_page=12` && r.method === 'GET',
      );
      expect(req.request.urlWithParams).toContain('_page=2');
      expect(req.request.urlWithParams).toContain('_per_page=12');
      req.flush({ first: 0, prev: 0, next: 0, last: 0, pages: 0, items: 0, data: [] });
    });

    it('should combine multiple categories into a single comma-joined, slugified category_in param', () => {
      const categories: CategoryFilter[] = [
        { name: 'Vestidos', slug: 'Vestidos', count: 1, img: '', checked: true },
        { name: 'Calças', slug: 'Calças', count: 1, img: '', checked: true },
      ];
      service.getProducts({ categories }).subscribe();
      const req = httpMock.expectOne((r) =>
        r.url.startsWith(`${environment.apiUrl}/products?_page=`),
      );
      expect(req.request.params.getAll('category_in')).toEqual(['vestidos,calcas']);
      req.flush({ first: 0, prev: 0, next: 0, last: 0, pages: 0, items: 0, data: [] });
    });

    it('should append one colors_contains param per color', () => {
      const colors: ColorFilter[] = [
        { name: 'Black', hex: '#000', checked: true },
        { name: 'White', hex: '#fff', checked: true },
      ];
      service.getProducts({ colors }).subscribe();
      const req = httpMock.expectOne((r) =>
        r.url.startsWith(`${environment.apiUrl}/products?_page=`),
      );
      expect(req.request.params.getAll('colors_contains')).toEqual(['#000', '#fff']);
      req.flush({ first: 0, prev: 0, next: 0, last: 0, pages: 0, items: 0, data: [] });
    });

    it('should append one sizes_contains param per size', () => {
      const sizes: SizeFilter[] = [
        { name: 'P', checked: true },
        { name: 'M', checked: true },
      ];
      service.getProducts({ sizes }).subscribe();
      const req = httpMock.expectOne((r) =>
        r.url.startsWith(`${environment.apiUrl}/products?_page=`),
      );
      expect(req.request.params.getAll('sizes_contains')).toEqual(['P', 'M']);
      req.flush({ first: 0, prev: 0, next: 0, last: 0, pages: 0, items: 0, data: [] });
    });

    it('should append a slugified price_gte param for fromPrice', () => {
      const fromPrice: PriceFilter[] = [{ name: 'from', type: 'fromPrice', value: 100 }];
      service.getProducts({ fromPrice }).subscribe();
      const req = httpMock.expectOne((r) =>
        r.url.startsWith(`${environment.apiUrl}/products?_page=`),
      );
      expect(req.request.params.getAll('price_gte')).toEqual(['100']);
      req.flush({ first: 0, prev: 0, next: 0, last: 0, pages: 0, items: 0, data: [] });
    });

    it('should append a slugified price_lte param for toPrice', () => {
      const toPrice: PriceFilter[] = [{ name: 'to', type: 'toPrice', value: 500 }];
      service.getProducts({ toPrice }).subscribe();
      const req = httpMock.expectOne((r) =>
        r.url.startsWith(`${environment.apiUrl}/products?_page=`),
      );
      expect(req.request.params.getAll('price_lte')).toEqual(['500']);
      req.flush({ first: 0, prev: 0, next: 0, last: 0, pages: 0, items: 0, data: [] });
    });

    it.each<[SortFilter['type'], string, string]>([
      ['min-price', '_sort', 'price'],
      ['max-price', '_sort', '-price'],
      ['newest', 'isNew', 'true'],
      ['sale', 'isSale', 'true'],
      ['featured', 'featured', 'true'],
    ])('sort.type=%s should set %s=%s', (type, key, value) => {
      const sort: SortFilter[] = [{ name: type, type }];
      service.getProducts({ sort }).subscribe();
      const req = httpMock.expectOne((r) =>
        r.url.startsWith(`${environment.apiUrl}/products?_page=`),
      );
      expect(req.request.params.get(key)).toBe(value);
      req.flush({ first: 0, prev: 0, next: 0, last: 0, pages: 0, items: 0, data: [] });
    });

    it('should not append any sort-related param for sort.type "relevance"', () => {
      const sort: SortFilter[] = [{ name: 'relevance', type: 'relevance' }];
      service.getProducts({ sort }).subscribe();
      const req = httpMock.expectOne((r) =>
        r.url.startsWith(`${environment.apiUrl}/products?_page=`),
      );
      expect(req.request.params.keys().length).toBe(0);
      req.flush({ first: 0, prev: 0, next: 0, last: 0, pages: 0, items: 0, data: [] });
    });
  });

  describe('getFilters', () => {
    it('should GET /filters', () => {
      const response: FiltersApiResponse = { categories: [], sizes: [], colors: [] };
      let result: FiltersApiResponse | undefined;
      service.getFilters().subscribe((res) => (result = res));

      const req = httpMock.expectOne(`${environment.apiUrl}/filters`);
      expect(req.request.method).toBe('GET');
      req.flush(response);
      expect(result).toEqual(response);
    });
  });

  describe('getProduct', () => {
    it('should GET /products/:id', () => {
      let result: Product | undefined;
      service.getProduct(MOCK_PRODUCT.id).subscribe((res) => (result = res));

      const req = httpMock.expectOne(`${environment.apiUrl}/products/${MOCK_PRODUCT.id}`);
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_PRODUCT);
      expect(result).toEqual(MOCK_PRODUCT);
    });
  });

  describe('getRelatedProducts', () => {
    it('should GET /products filtered by category, excluding the given id, page 0, per_page 4', () => {
      const response: Pagination<Product> = {
        first: 0,
        prev: 0,
        next: 0,
        last: 0,
        pages: 1,
        items: 0,
        data: [],
      };
      let result: Pagination<Product> | undefined;
      service.getRelatedProducts(MOCK_PRODUCT).subscribe((res) => (result = res));

      const expectedUrl = `${environment.apiUrl}/products?category=${MOCK_PRODUCT.category}&id:ne=${MOCK_PRODUCT.id}&_page=0&_per_page=4`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(response);
      expect(result).toEqual(response);
    });
  });

  describe('slugify', () => {
    it('should lowercase and strip accents', () => {
      expect(service.slugify('Café')).toBe('cafe');
      expect(service.slugify('Índigo')).toBe('indigo');
      expect(service.slugify('Calças')).toBe('calcas');
    });

    it('should leave already-plain strings unchanged aside from lowercasing', () => {
      expect(service.slugify('Vestidos')).toBe('vestidos');
    });
  });
});
