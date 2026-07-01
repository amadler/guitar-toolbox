import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ApiService } from './api.service';
import { API_BASE_URL } from './api-config.token';

describe('ApiService', () => {
  let httpTestingController: HttpTestingController;

  describe('with default API_BASE_URL', () => {
    let service: ApiService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      service = TestBed.inject(ApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should send a GET request to the default endpoint', () => {
      const query = { type: 'scale', musicElements: 'Major', keys: 'C' };

      service.sendToolboxRequest(query).subscribe(response => {
        expect(response).toEqual({ notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] });
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/scales/Major/C');
      expect(req.request.method).toBe('GET');
      req.flush({ notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] });
    });

    it('should throw an error for 404 status', () => {
      const query = { type: 'scale', musicElements: 'NonExistent', keys: 'C' };

      service.sendToolboxRequest(query).subscribe({
        next: () => fail('Expected an error'),
        error: (error: Error) => {
          expect(error.message).toBe('Endpoint not found. Please check if the API server is running.');
        }
      });

      const req = httpTestingController.expectOne('http://localhost:3000/api/scales/NonExistent/C');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('with custom API_BASE_URL', () => {
    let service: ApiService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          { provide: API_BASE_URL, useValue: 'https://api.production.com/api' }
        ]
      });
      service = TestBed.inject(ApiService);
      httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpTestingController.verify();
    });

    it('should send a GET request to the custom endpoint', () => {
      const query = { type: 'scale', musicElements: 'Major', keys: 'C' };

      service.sendToolboxRequest(query).subscribe(response => {
        expect(response).toEqual({ notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] });
      });

      const req = httpTestingController.expectOne('https://api.production.com/api/scales/Major/C');
      expect(req.request.method).toBe('GET');
      req.flush({ notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] });
    });
  });
});
