import {Component, Input} from '@angular/core';
import {News} from "../../../model/models";
import {Router} from "@angular/router";
import {ImageService} from "../../../services/image.service";
import {Product} from "../../../model/product";

@Component({
  selector: 'news-item',
  templateUrl: './news-item.component.html',
  styleUrls: ['./news-item.component.less']
})
export class NewsItemComponent {


  @Input()
  news: News;

  constructor(
    private router: Router,
    public imageService: ImageService
  ) {
  }

  openNews($event: News){

    this.router.navigate(['news-info', $event.id ])

  }


}
