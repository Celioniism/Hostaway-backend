import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CsvService } from 'src/app/services/csv.service';

import * as confetti from 'canvas-confetti';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  myScriptElement: HTMLScriptElement;
  constructor(
    private fileUploadService: CsvService,
    private renderer2: Renderer2,
    private elementRef: ElementRef
  ) {}
  Current: string;
  shortLink: any;
  file: File;
  loading: boolean;
  done: boolean = false;
  public clicked = false;
  ngOnInit(): void {
    this.fileUploadService.getCurrent().subscribe(
      (response) => {},
      (error) => {
        this.Current = error.error.text;
        console.log(error.error.text);
      }
    );
  }

  // On file Select
  onChange(event) {
    this.file = event.target.files[0];
  }

  // OnClick of button Upload
  onUpload() {
    this.loading = !this.loading;
    console.log(this.file);
    var filePath = this.file.type;
    console.log(filePath);

    if (filePath != 'text/csv') {
      alert('Invalid file type');
      this.file = null;
      return false;
    }

    this.fileUploadService.upload(this.file).subscribe(
      (response) => {},
      (error) => {
        console.log(error.error.text);
        if (error.error.text == 'Completed Successfully') {
          // Short link via api response
          this.loading = false; // Flag variable
          this.done = true;
          this.confettiServe();
        }
      }
    );
  }

  public surprise(): void {
    const canvas = this.renderer2.createElement('canvas');

    this.renderer2.appendChild(this.elementRef.nativeElement, canvas);

    const myConfetti = confetti.create(canvas, {
      resize: true, // will fit all screen sizes
    });

    myConfetti({ particleCount: 100, spread: 160 });

    this.clicked = true;
  }
  //conf
  confettiServe() {
    this.surprise();
  }
}
