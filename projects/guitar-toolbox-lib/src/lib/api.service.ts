import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  sendToolboxRequest(query: { type: string, musicElements: string, keys: string }) {
    const url = `${this.apiUrl}/${query.type}s/${query.musicElements}/${query.keys}`;
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
