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
  pupMade: boolean = false;
  message: string = '';
  public clicked = false;
  ngOnInit(): void {
    this.fileUploadService.getCurrent().subscribe(
      (response) => {
        this.Current = response;
      },
      (error) => {
        this.Current = error.error.text;
        console.log(error.error.text);
        console.log(error);
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
    var canvas = document.getElementById('custom-canvas');

    const myConfetti = confetti.create(canvas, {
      resize: true, // will fit all screen sizes
    });

    myConfetti({ particleCount: 100, spread: 160 });
    this.fileUploadService.createPupReport().subscribe((response) => {
      this.message = response;
      this.pupMade = true;
    });
    this.clicked = true;
  }
  //conf
  confettiServe() {
    this.surprise();
  }
}
