import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private sendEmailAPIUrl = `${environment.apiUrl}/send-email`;
  private sendEmailWithAttachmentAPIUrl = `${environment.apiUrl}/send-email-with-attachments`;

  constructor(private http: HttpClient) {}

  sendEmail(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }): Observable<any> {
    return this.http.post(this.sendEmailAPIUrl, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  sendEmailWithAttachments(formData: FormData) {
    return this.http.post(this.sendEmailWithAttachmentAPIUrl, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
