import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  // Use relative path so Angular dev server proxy handles CORS
  private apiUrl = '/api/send-email';

  constructor(private http: HttpClient) {}

  // sendEmail(data: {
  //   name: string;
  //   email: string;
  //   subject?: string;
  //   message: string;
  // }): Observable<any> {
  //   // All requests to /api/send-email will be proxied in dev
  //   return this.http.post(this.apiUrl, data);
  // }

  sendEmail(formData: FormData) {
    // return this.http.post(
    //   'https://your-vercel-app.vercel.app/api/send-email',
    //   formData
    // );
    return this.http.post(this.apiUrl, formData);
  }
}
