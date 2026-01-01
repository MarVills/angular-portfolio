import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-file-preview-dialog',
  templateUrl: './file-preview-dialog.component.html',
  styleUrls: ['./file-preview-dialog.component.scss'],
})
export class FilePreviewDialogComponent implements OnInit {
  @Input() fileName: string = '';
  @Input() fileUrl: string | null = null;
  @Input() visible: boolean = false;
  @Input() fadeClass = '';
  @Input() dialogTypeClass = '';
  @Input() fileType = '';

  @Output() close = new EventEmitter<void>();

  safeFileUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.fileUrl && this.isPDF(this.fileName)) {
      // sanitize PDF URL
      this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.fileUrl
      );
    }
  }

  // // helpers to detect file type
  // isImage(name: string): boolean {
  //   return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(name);
  // }

  // isPDF(name: string): boolean {
  //   return /\.pdf$/i.test(name);
  // }

  // Helper methods
  isImage(name: string) {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(name);
  }
  isPDF(name: string) {
    return /\.pdf$/i.test(name);
  }
  isVideo(name: string) {
    return /\.(mp4|webm|ogg)$/i.test(name);
  }
  isAudio(name: string) {
    return /\.(mp3|wav|ogg)$/i.test(name);
  }
  isOther(name: string) {
    return (
      !this.isImage(name) &&
      !this.isPDF(name) &&
      !this.isVideo(name) &&
      !this.isAudio(name)
    );
  }

  onClose() {
    setTimeout(() => this.close.emit(), 200);
  }
}
