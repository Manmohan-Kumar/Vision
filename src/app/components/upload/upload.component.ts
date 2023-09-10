import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { FileModel } from 'src/app/interface/file-model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  constructor(private http: HttpClient,
    private sanitizer: DomSanitizer) { }

  fileModel: FileModel | undefined;

  selectedFile: File | any = null;
  progress: number = 0;
  message: string = '';

  onFileSelected(event: any) {
    console.log(event);
    this.selectedFile = <File>event.target.files[0];

    const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.selectedFile));
    this.fileModel = { file: this.selectedFile, url: url };
  }
  onUpload() {
    const ufd = new FormData();
    ufd.append('image', this.selectedFile, this.selectedFile?.name);
    /*console.log('ufd', ufd);
    console.log('fileModel', this.fileModel);*/

    this.submitFile(ufd);
  }
  @Output() public onUploadFinished = new EventEmitter();

  private submitFile(ufd: FormData) {
    this.http.post('http://localhost:8080/vision/fileUpload', ufd, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / (event.total || 1));
          console.log(this.progress);
        }
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
          console.log(event.body);
        }
      },
      error: (err: HttpErrorResponse) => console.log(err)
    });
  }

  fileDropped(event: FileModel) {
    //console.log(event);
    this.fileModel = { file: event.file, url: event.url };
    this.selectedFile = <File>event.file;

    /*const ufd = new FormData();
    ufd.append('image', event.file, event.file.name);
    this.submitFile(ufd);*/
  }
  removeImage() {
    this.selectedFile = null;
    delete this.fileModel;
  }
  isDisabled() {
    if (this.selectedFile === null)
      return true;
    else
      return false;
  }
}
