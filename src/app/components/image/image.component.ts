import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.less']
})
export class ImageComponent implements OnInit {

  imageToShow: string = "assets/not_found.png";

  @Input()
  imageLink: string;

  @Input()
  alt: string;

  constructor(private imageService: ImageService) {
  }

  getImage(): string {
    if (this.imageLink) {
      this.imageToShow = this.imageService.changeImageUrl(this.imageLink);
    }
    return this.imageToShow
  }

  ngOnInit(): void {
      this.getImage()

  }


}
