import { Component, OnInit } from '@angular/core';
import { TranslationLoaderService } from '../services/translation-loader.service';
import { locale as english } from '../shared/i18n/en';
import { locale as french } from '../shared/i18n/fr';
import { HttpClient } from '@angular/common/http';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  name = '';
  email = '';
  subject = '';
  message = '';
  isSending = false;
  successMessage = '';
  errorMessage = '';
  selectedFiles: File[] = [];

  constructor(
    private _translationLoaderService: TranslationLoaderService,
    private emailService: EmailService,
    private http: HttpClient
  ) {
    this._translationLoaderService.loadTranslations(english, french);
  }

  ngOnInit(): void {}

  sendEmail() {
    this.isSending = true;
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('subject', this.subject);
    formData.append('message', this.message);
    this.selectedFiles.forEach((file) => {
      formData.append('attachments', file);
    });
    // Uncomment this if you want to test locally with your backend
    this.http.post('http://localhost:3000/send-email', formData).subscribe({
      next: (res) => {
        console.log(res);
        this.isSending = false;
        alert('Email sent successfully!');
        this.name = '';
        this.email = '';
        this.subject = '';
        this.message = '';
        this.selectedFiles = [];
      },
      error: (err) => {
        console.error('Email send error:', err);
        this.isSending = false;
        alert('Failed to send email. Please try again later.');
      },
    });
    // // Use EmailService (works with proxy or production environment)
    // this.emailService.sendEmail(formData).subscribe({
    //   next: (res) => {
    //     console.log(res);
    //     alert('Email sent successfully!');
    //     // Clear form fields
    //     this.name = '';
    //     this.email = '';
    //     this.subject = '';
    //     this.message = '';
    //     this.selectedFiles = [];
    //   },
    //   error: (err) => {
    //     console.error('Email send error:', err);
    //     alert('Failed to send email. Please try again later.');
    //   },
    // });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = Array.from(files);
  }
}
