import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {map, Subject, switchMap} from "rxjs";
import {ProductService} from "../../services/product.service";
import {Product} from "../../model/product";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {ImageService} from "../../services/image.service";
import {Slide} from "../../model/models";
import {environment} from "../../../environments/environment";
import {Meta, Title} from "@angular/platform-browser";
import {PageService} from "../../services/page.service";

@Component({
  selector: 'product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.less',
  ]
})
export class ProductInfoComponent implements OnDestroy, OnInit, AfterViewInit {

  private destroySubject: Subject<void> = new Subject();
  product: Product = new Product();
  countInCart = 0;
  allImages: Slide[] = [];

  viewSlider: boolean = false;

  coverTypes: any;

  imageShadowStyle: any = {}

  // tagDescription: HTMLMetaElement | null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private imageService: ImageService,
    private pageService:  PageService,
  ) {
  }

  ngOnInit() {


    this.coverTypes = environment.coverTypes;

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
          return this.productService.getProductInfo(params?.get('id'));
        }
      ),
      map((res: Product) => {
        this.product = res;
        this.pageService.setTitle(this.product.author + "; " + this.product.name + "; Цена: " + this.product.retailPriceEuro)

        this.pageService.setMetaTagDescription(this.product.author + "; " + this.product.name + "; " + this.product.shortDescription)

        if (this.product.productType.type  == 'games') {
            this.imageShadowStyle = {"box-shadow": "none"};
        }


        this.allImages = [];
        this.countInCart = this.cartService.getProductCount(this.product.id);

        if (this.product.mainPhoto) {
          this.allImages.push(new Slide({
            image: this.imageService.changeImageUrl(this.product.mainPhoto),
            number: this.allImages.length,

          }));
        }

        if (this.product.imageLink) {
          this.allImages.push(new Slide({
            image: this.product.imageLink,
            number: this.allImages.length,

          }));
        }


        this.product.photos?.forEach((photo) => {

          this.allImages.push(new Slide({
            image: this.imageService.changeImageUrl(photo.photo),
            number: this.allImages.length,
            text: ''
          }));
        })

    this.viewSlider = window.innerWidth < 800 && this.allImages.length > 1;



      })
    )
      .subscribe();
  }


  ngAfterViewInit() {

  }


  ngOnDestroy() {
    this.destroySubject.next();
    this.pageService.setBaseTitle();

    this.pageService.removeMetaTagDescription();



  }

  addToCart() {
    this.cartService.addToCart(this.product);
    this.countInCart += 1;
  }

  deleteFromCart() {
    this.cartService.deleteFromCart(this.product)
  }


}
