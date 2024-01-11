import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ImageService} from "../services/image.service";

@Component({
  selector: 'image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.less']
})
export class ImageComponent implements OnInit {

  imageToShow: string;

  @Input()
  imageLink: string;

  constructor(private imageService: ImageService) {
  }

  getImage() {
    if (this.imageLink) {
      this.imageToShow = '/api/' + this.imageLink.substring(this.imageLink.indexOf('media'), this.imageLink.length);
    }
  }

  ngOnInit(): void {
    this.getImage()

  }


}
