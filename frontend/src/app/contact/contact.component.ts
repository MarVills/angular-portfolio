import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslationLoaderService } from '../service/translation-loader.service';
import { locale as english } from '../shared/i18n/en';
import { locale as french } from '../shared/i18n/fr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  name = '';
  email = '';
  message = '';

  constructor(
    private _translationLoaderService: TranslationLoaderService,
    private http: HttpClient
  ) {
    this._translationLoaderService.loadTranslations(english, french);
  }

  ngOnInit(): void {}

  sendEmail() {
    this.http
      .post('http://localhost:3000/send-email', {
        name: this.name,
        email: this.email,
        message: this.message,
      })
      .subscribe({
        next: () => alert('Email sent!'),
        error: () => alert('Failed to send email'),
      });
  }
}
