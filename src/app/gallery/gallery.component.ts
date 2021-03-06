import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  @Input() datasource;
  selectedImage;

  constructor() {}

  setSelectedImage(image) {
    this.selectedImage = image;
  }

  navigate(forward) {
    let index = this.datasource.indexOf(this.selectedImage) + (forward ? 1 : -1);
    if (index >= 0 && index < this.datasource.length) {
      this.selectedImage = this.datasource[index];
    }
  }
}
