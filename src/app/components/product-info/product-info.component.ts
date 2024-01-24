import {
  AfterViewInit,
  Component, ElementRef,
  OnDestroy,
  OnInit, ViewChild,
} from '@angular/core';
import {map, Subject, switchMap} from "rxjs";
import {ProductService} from "../../services/product.service";
import {Product} from "../../model/product";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {ImageService} from "../../services/image.service";
import {Slide} from "../../model/models";
import KeenSlider from "keen-slider";

@Component({
  selector: 'product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.less',
  ]
})
export class ProductInfoComponent implements OnDestroy, OnInit, AfterViewInit{

  private destroySubject: Subject<void> = new Subject();
  product: Product = new Product();
  countInCart = 0;
  allImages: Slide[] = [];

  viewSlider: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private imageService: ImageService,
  ) {
  }

  ngOnInit() {

    this.viewSlider  = window.innerWidth < 800;

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

      })
    )
      .subscribe();
  }



  ngAfterViewInit() {

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
