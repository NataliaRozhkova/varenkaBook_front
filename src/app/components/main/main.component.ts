import {Component,  OnInit} from '@angular/core';
import {Slide} from "../../model/models";
import {Product} from "../../model/product";
import {ProductService} from "../../services/product.service";
import { Subject,  takeUntil} from "rxjs";
import {InformationService} from "../../services/information.service";

@Component({
  selector: 'contacts',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit{

  sliderImages: Slide[] = [
    new Slide({
      image: '/assets/main-slider/cover_rgb_web_2800x1200.jpg',
      text: '',
      number: 1
    })
  ]

  textAbout: string = '';

  private destroySubject: Subject<void> = new Subject();


  mainProducts: Product[];
  products: Product[];

  constructor(
    private productService: ProductService,
    private infoService: InformationService,
  ) {}
  ngOnInit() {


    this.infoService.getFrontParams().pipe(
      takeUntil(this.destroySubject),
    )
      .subscribe(
      (res) => {
        this.textAbout = res.results.find ((value:any) =>  value.name == 'text-about')?.value;

    })

  }


  ngOnDestroy() {
  }

}
