import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {map, Subject, switchMap} from "rxjs";
import {ProductService} from "../../services/product.service";
import {Product} from "../../model/product";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {ImageService} from "../../services/image.service";
import {Slide} from "../../model/models";
import {SliderComponent} from "../slider/slider.component";

@Component({
  selector: 'product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.less']
})
export class ProductInfoComponent implements OnDestroy, OnInit {

  private destroySubject: Subject<void> = new Subject();
  product: Product = new Product();
  countInCart = 0;
  allImages: Slide[] = [
    // new Slide({
    //   image: '/assets/slider2.jpg',
    //   text: '/assets/new.png',
    //   number: 1
    // }),
    // new Slide(
    //   {
    //     image: '/assets/slider2.jpg',
    //     text: '/assets/new.png',
    //     number: 0
    //   }),
  ]

  testArr: Slide[] =
    [
      new Slide({
        "image": "/api/media/main_photos/%D0%BE%D0%B1_%D0%B0%D0%BF%D1%80%D0%BB%D0%B6%D1%8B%D0%B0%D1%82_RNgLPRo.png",
        "number": 0,
        text: '/assets/new.png',

      }),
      new Slide({
        "image": "/api/media/photos/photo_2024-01-15_14-03-55.jpg",
        "number": 1,
        text: '/assets/new.png',

      }),
      // new Slide({
      //   "image": "/api/media/photos/%D0%BE%D0%B8%D0%BE%D0%B8_T8FF1qD.png",
      //   "number": 2
      // }),
      // new Slide({
      //   "image": "/api/media/photos/%D0%BE%D0%B1_%D0%B0%D0%BF%D1%80%D0%BB%D0%B6%D1%8B%D0%B0%D1%82_g9U3vod.png",
      //   "number": 3
      // }),
      // new Slide({
      //   "image": "/api/media/photos/%D0%BE%D0%B8%D0%BE_OY4RImU.png",
      //   "number": 4
      // })
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
    ]

  //
  // @ViewChild('slider')
  // slider: SliderComponent = new SliderComponent();

  // testBlock

  @ViewChild('testBlock', {static: true, read: ViewContainerRef}) testBlock: ViewContainerRef;

  cdr = inject(ChangeDetectorRef);

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private imageService: ImageService,
    // private componentFactoryResolver: ComponentFactoryResolver
    private viewContainerRef: ViewContainerRef
  ) {
  }

  ngOnInit() {

    console.log("******   ", this.allImages)

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
          return this.productService.getProductInfo(params?.get('id'));
        }
      ),
      map((res: Product) => {
        this.product = res;

        this.allImages = [];
        this.countInCart = this.cartService.getProductCount(this.product.id);

        this.allImages.push(new Slide({
          image: this.imageService.changeImageUrl(this.product.mainPhoto),
          number: this.allImages.length,

        }));
        this.product.photos.forEach((photo) => {
          this.allImages.push(new Slide({
            image: this.imageService.changeImageUrl(photo.photo),
            number: this.allImages.length,
            text: ''
          }));
        })
        // this.allImages = this.testArr;
        console.log("******   ", this.allImages)
        // this.slider.refresh()
        // this.createSlider()

      })
    )
      .subscribe();
  }

  createSlider() {

    // this.testBlock.clear();


    let ref = this.testBlock.createComponent(SliderComponent);
    ref.instance.slidesArray = this.allImages;
    ref.instance.timeOut = 1000;
    this.cdr.detectChanges();


  }

  ngOnDestroy() {
    this.destroySubject.next();
  }

  addToCart() {
    this.cartService.addToCart(this.product);
    this.countInCart += 1;
  }

  deleteFromCart() {
    this.cartService.deleteFromCart(this.product)
  }


}
