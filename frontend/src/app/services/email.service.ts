import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private sendEmailAPIUrl = '/api/send-email';
  // private sendEmailAPIUrl =
  //   'https://angular-portfolio.vercel.app/api/send-email';
  private sendEmailWithAttachmentAPIUrl =
    'https://angular-portfolio.vercel.app/api/send-email-with-attachments';

  constructor(private http: HttpClient) {}

  sendEmail(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }): Observable<any> {
    console.log('sendEmailAPIUrl', this.sendEmailAPIUrl);
    return this.http.post(this.sendEmailAPIUrl, data);
  }

  sendEmailWithAttachments(formData: FormData) {
    return this.http.post(this.sendEmailWithAttachmentAPIUrl, formData);
  }
}
