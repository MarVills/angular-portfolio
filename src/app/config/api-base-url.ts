import { environment } from 'src/environments/environment';

export function getApiBaseUrl(): string {
  if (!environment.production && window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  return environment.apiUrl;
}
