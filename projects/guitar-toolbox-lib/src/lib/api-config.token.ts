import { InjectionToken } from '@angular/core';

/**
 * InjectionToken for configuring the API base URL.
 *
 * Default: 'http://localhost:3000/api'
 *
 * Override in app.config.ts:
 * ```
 * import { API_BASE_URL } from 'guitar-toolbox-lib';
 *
 * providers: [
 *   { provide: API_BASE_URL, useValue: 'https://api.production.com/api' }
 * ]
 * ```
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:3000/api'
});
