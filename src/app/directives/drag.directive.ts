import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileModel } from '../interface/file-model';

@Directive({
  selector: '[appDrag]'
})
export class DragDirective {
  @Output()
  files: EventEmitter<FileModel> = new EventEmitter();

  constructor(private sanitizer: DomSanitizer) { }

  @HostBinding("style.background") private background = "bisque";

  @HostListener("dragover", ["$event"])
  onDragOver(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();
    this.background="#999";
  }
  @HostListener("dragleave", ["$event"])
  onDragLeave(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();
    this.background="bisque";
  }
  @HostListener("drop", ["$event"])
  onDrop(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();
    this.background="#eee";

    let fileModel: FileModel;
    const file:any = evt.dataTransfer?.files[0];
    const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
    fileModel = {file, url};
    console.log('emitting');
    this.files.emit(fileModel);
  }

}
