import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslationLoaderService } from '../services/translation-loader.service';
import { locale as english } from '../shared/i18n/en';
import { locale as french } from '../shared/i18n/fr';
import { HttpClient } from '@angular/common/http';
import { EmailService } from '../services/email.service';
import { environment } from '../../environments/environment';
import { getApiBaseUrl } from '../config/api-base-url';
// import { Resend } from 'resend';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  name: string = '';
  email: string = '';
  subject: string = '';
  message: string = '';
  isSending: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  selectedFiles: File[] = [];
  fileNames: string = '';
  previewFileUrl: string | null = null;
  previewFileName: string = '';
  showPreview: boolean = false;
  fadeClass: string = '';
  dialogTypeClass: string = '';

  private sendEmailAPIUrl = `${getApiBaseUrl()}/send-email`;
  private sendEmailWithAttachmentAPIUrl = `${getApiBaseUrl()}/send-email-with-attachments`;

  constructor(
    private _translationLoaderService: TranslationLoaderService,
    private emailService: EmailService,
    private http: HttpClient,
  ) {
    this._translationLoaderService.loadTranslations(english, french);
  }

  ngOnInit(): void {}

  async sendEmailJs() {
    if (!this.name || !this.email || !this.message) {
      alert('Please fill all required fields!');
      return;
    }
    this.isSending = true;

    try {
      let attachmentInfo = '';
      if (this.selectedFiles.length > 0) {
        attachmentInfo = this.selectedFiles
          .map((file) => `Attachment: ${file.name} (please provide link)`)
          .join('\n');
      }

      const templateParams = {
        name: this.name, // match EmailJS template
        email: this.email,
        subject: this.subject,
        message: this.message,
        time: new Date().toLocaleString(),
        attachment_info: attachmentInfo,
      };

      await emailjs.send(
        'service_obmogud', // your Service ID
        'template_hx7cmdn', // your Template ID
        templateParams,
        'OVaIyrUsnfxVv6vm8', // Public Key
      );

      alert('Email sent successfully!');
      this.clearForm();
    } catch (error) {
      console.error('EmailJS error:', error);
      alert('Failed to send email.');
    } finally {
      this.isSending = false;
    }
  }

  // async sendEmailJs() {
  //   if (!this.name || !this.email || !this.message) {
  //     alert('Please fill all required fields!');
  //     return;
  //   }
  //   this.isSending = true;
  //   try {
  //     const MAX_ATTACHMENT_SIZE = 50 * 1024; // 50 KB limit
  //     const totalSize = this.selectedFiles.reduce((sum, f) => sum + f.size, 0);

  //     let attachmentInfo = '';

  //     if (totalSize > MAX_ATTACHMENT_SIZE) {
  //       attachmentInfo =
  //         'Attachments are too large. Please share links instead.';
  //     } else if (this.selectedFiles.length > 0) {
  //       const attachments = await Promise.all(
  //         this.selectedFiles.map((file) => this.fileToBase64(file)),
  //       );

  //       attachmentInfo = attachments
  //         .map(
  //           (data, index) =>
  //             `${this.selectedFiles[index].name} (Base64 attached)`,
  //         )
  //         .join(', ');
  //     }

  //     const templateParams = {
  //       name: this.name,
  //       email: this.email,
  //       subject: this.subject,
  //       message: this.message,
  //       time: new Date().toLocaleString(),
  //       attachment_info: attachmentInfo,
  //     };

  //     await emailjs.send(
  //       'service_obmogud',
  //       'template_hx7cmdn',
  //       templateParams,
  //       'OVaIyrUsnfxVv6vm8',
  //     );

  //     alert('Email sent with attachment!');
  //     this.clearForm();
  //   } catch (error) {
  //     console.error('EmailJS attachment error:', error);
  //     alert('Failed to send email.');
  //   } finally {
  //     this.isSending = false;
  //   }
  // }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  clearForm() {
    this.name = '';
    this.email = '';
    this.subject = '';
    this.message = '';
    this.selectedFiles = [];
  }

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
