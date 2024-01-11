import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import KeenSlider from 'keen-slider'
import {Slide} from "../model/models";
import {Product} from "../model/product";
import {ProductService} from "../services/product.service";
import {map, Subject, switchMap, takeUntil} from "rxjs";

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
        image: '/assets/new.png',
        text: '/assets/new.png',
        number: 0
      }),
  ]
  private destroySubject: Subject<void> = new Subject();


  mainProducts: Product[];
  products: Product[];

  constructor(
    private productService: ProductService,
  ) {}
  ngOnInit() {

  }


  ngOnDestroy() {
  }

}
