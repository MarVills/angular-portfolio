import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslationLoaderService } from '../services/translation-loader.service';
import { locale as english } from '../shared/i18n/en';
import { locale as french } from '../shared/i18n/fr';
import { HttpClient } from '@angular/common/http';
import { EmailService } from '../services/email.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  name = '';
  email = '';
  subject = '';
  message = '';
  isSending = false;
  successMessage = '';
  errorMessage = '';
  selectedFiles: File[] = [];
  fileNames: string = '';
  previewFileUrl: string | null = null;
  previewFileName: string = '';
  showPreview: boolean = false;
  fadeClass = '';
  dialogTypeClass = '';

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
    if (this.selectedFiles.length === 0) {
      console.log('sending WITHOUT attachment!');
      this.sendEmailWithoutAttachment();
    } else {
      console.log('sending WITH attachment!');
      this.sendEmailWithAttachment();
    }
  }

  private sendEmailWithoutAttachment() {
    const payload = {
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message,
    };
    if (environment.production) {
      this.emailService.sendEmail(payload).subscribe({
        next: () => {
          this.name = '';
          this.email = '';
          this.subject = '';
          this.message = '';
          this.isSending = false;
          alert('Email sent successfully!');
        },
        error: (err) => this.errorSendingEmail(err),
      });
    } else {
      this.http.post('http://localhost:3000/send-email', payload).subscribe({
        next: () => {
          this.name = '';
          this.email = '';
          this.subject = '';
          this.message = '';
          alert('Email sent successfully!');
          this.isSending = false;
        },
        error: (err) => this.errorSendingEmail(err),
      });
    }
  }

  private sendEmailWithAttachment() {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('subject', this.subject);
    formData.append('message', this.message);
    this.selectedFiles.forEach((file) => {
      formData.append('attachments', file);
    });
    if (environment.production) {
      this.emailService.sendEmailWithAttachments(formData).subscribe({
        next: () => {
          this.name = '';
          this.email = '';
          this.subject = '';
          this.message = '';
          this.selectedFiles = [];
          this.fileInput.nativeElement.value = '';
          alert('Email sent successfully!');
          this.isSending = false;
        },
        error: (err) => this.errorSendingEmail(err),
      });
    } else {
      this.http
        .post('http://localhost:3000/send-email-with-attachment', formData)
        .subscribe({
          next: (res) => {
            this.name = '';
            this.email = '';
            this.subject = '';
            this.message = '';
            this.selectedFiles = [];
            this.fileInput.nativeElement.value = '';
            alert('Email sent successfully!');
            this.isSending = false;
          },
          error: (err) => this.errorSendingEmail(err),
        });
    }
  }

  private errorSendingEmail(error: any) {
    console.error('Email send error:', error);
    this.isSending = false;
    alert('Failed to send email. Please try again later.');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles.push(...Array.from(input.files));
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  clearAllFiles() {
    this.selectedFiles = [];
    this.closePreview();
  }

  previewFile(file: File) {
    this.previewFileName = file.name;
    this.fadeClass = 'fade-in';

    const type = file.type;

    if (type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewFileUrl = e.target?.result as string;
        this.dialogTypeClass = 'image-dialog';
        this.showPreview = true;
      };
      reader.readAsDataURL(file);
    } else if (type === 'application/pdf') {
      this.previewFileUrl = URL.createObjectURL(file);
      this.dialogTypeClass = 'pdf-dialog';
      this.showPreview = true;
    } else if (type.startsWith('video/')) {
      this.previewFileUrl = URL.createObjectURL(file);
      this.dialogTypeClass = 'video-dialog';
      this.showPreview = true;
    } else if (type.startsWith('audio/')) {
      this.previewFileUrl = URL.createObjectURL(file);
      this.dialogTypeClass = 'audio-dialog';
      this.showPreview = true;
    } else {
      this.previewFileUrl = URL.createObjectURL(file);
      this.dialogTypeClass = 'other-dialog';
      this.showPreview = true;
    }
  }

  closePreview() {
    this.fadeClass = 'fade-out';
    setTimeout(() => {
      this.showPreview = false;
      this.previewFileUrl = null;
      this.previewFileName = '';
    }, 200);
  }
}
