import { Component } from '@angular/core';
import { CsvService } from 'src/app/services/csv.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  constructor(private fileUploadService: CsvService) {}
  shortLink: any;
  file: File;
  loading: boolean;
  ngOnInit(): void {}

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
    this.fileUploadService.upload(this.file).subscribe((event: any) => {
      if (typeof event === 'object') {
        // Short link via api response
        this.shortLink = event.link;

        this.loading = false; // Flag variable
      }
    });
  }
}
