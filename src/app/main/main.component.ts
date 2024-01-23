import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import KeenSlider from 'keen-slider'
import {Slide} from "../model/models";
import {Product} from "../model/product";
import {ProductService} from "../services/product.service";
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {InformationService} from "../services/information.service";

@Component({
  selector: 'contacts',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit{

  sliderImages: Slide[] = [
    new Slide({
      image: '/assets/slider2.jpg',
      text: '/assets/new.png',
      number: 1
    }),
    new Slide(
      {
        image: '/assets/slider2.jpg',
        text: '/assets/new.png',
        number: 0
      }),
    new Slide(
      {
        image: '/assets/logo_small.png',
        text: '/assets/new.png',
        number: 0
      }),
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
