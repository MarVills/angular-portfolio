import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private _translationLoaderService: TranslationLoaderService,
    private emailService: EmailService,
    private http: HttpClient
  ) {
    this._translationLoaderService.loadTranslations(english, french);
  }

  ngOnInit(): void {}

  sendEmail() {
    const payload = {
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message,
    };

    // // Uncomment this if you want to test locally with your backend
    // this.http.post('http://localhost:3000/send-email', payload).subscribe({
    //   next: () => {
    //     alert('Email sent successfully!');
    //     this.name = '';
    //     this.email = '';
    //     this.subject = '';
    //     this.message = '';
    //   },
    //   error: () => {
    //     alert('Failed to send email. Please try again later.');
    //   },
    // });

    // Use EmailService (works with proxy or production environment)
    this.emailService.sendEmail(payload).subscribe({
      next: () => {
        alert('Email sent successfully!');
        // Clear form fields
        this.name = '';
        this.email = '';
        this.subject = '';
        this.message = '';
      },
      error: (err) => {
        console.error('Email send error:', err);
        alert('Failed to send email. Please try again later.');
      },
    });
  }
}
