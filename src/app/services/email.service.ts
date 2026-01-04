import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private baseUrl: string = environment.localApiUrl;
  private sendEmailAPIUrl = `${this.baseUrl}/send-email`;
  private sendEmailWithAttachmentAPIUrl = `${this.baseUrl}/send-email-with-attachments`;

  constructor(private http: HttpClient) {
    if (environment.type == 'local' && !environment.production) {
      this.baseUrl = environment.localApiUrl;
    } else {
      this.baseUrl = environment.apiUrl;
    }

    // this.sendEmailAPIUrl = `/api/send-email`;
    this.sendEmailAPIUrl =
      'https://angular-portfolio.vercel.app/api/send-email';
    this.sendEmailWithAttachmentAPIUrl = `${this.baseUrl}/send-email-with-attachments`;
  }

  sendEmail(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Observable<any> {
    console.log('sendEmailAPIUrl', this.sendEmailAPIUrl);
    return this.http.post(
      this.sendEmailAPIUrl,
      data
      //   {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // }
    );
  }

  sendEmailWithAttachments(formData: FormData) {
    return this.http.post(this.sendEmailWithAttachmentAPIUrl, formData);
  }
}
