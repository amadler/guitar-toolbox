import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { API_BASE_URL } from './api-config.token';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiUrl: string
  ) { }

  sendToolboxRequest(query: { type: string, musicElements: string | number[], keys: string }) {
    const elements = Array.isArray(query.musicElements)
      ? query.musicElements.join(',')
      : query.musicElements;
    const url = `${this.apiUrl}/${query.type}s/${elements}/${query.keys}`;
    console.log('Requesting URL:', url);

    return this.http.get(url).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return throwError(() => new Error('Endpoint not found. Please check if the API server is running.'));
        }
        if (error.status === 500) {
          return throwError(() => new Error('Internal server error. Please try again later.'));
        }
        return throwError(() => new Error('An unexpected error occurred.'));
      })
    );
  }
}
