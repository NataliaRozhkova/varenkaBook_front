import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  AfterContentChecked,
  ViewChild,
  AfterContentInit
} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {ActivatedRoute} from "@angular/router";
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {ProductsListComponent} from "../products/products-list.component";
import {Location} from '@angular/common';
import {PagePosition, PageService} from "../../services/page.service";
import {InformationService} from "../../services/information.service";

@Component({
  selector: 'search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.less'],

})
export class SearchPageComponent implements OnInit, OnDestroy, AfterContentChecked {


  private destroySubject: Subject<void> = new Subject();

  productsOnPage: number = 12;

  searchInStock: boolean = true;

  @ViewChild('productsInStock')
  productsInStock: ProductsListComponent;
  @ViewChild('productsToOrder')
  productsToOrder: ProductsListComponent;

  selectedTab: number = 0;

  availability: string = 'in_stock'
  search: string;
  cdr = inject(ChangeDetectorRef);
  content: HTMLElement | null;
  position: PagePosition;

  pageName: string = 'searchInStock';
  deliveryWarningText: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private location: Location,
    private pageService: PageService,
    private informationService: InformationService,
  ) {
  }

  ngOnInit() {

      this.content = document.getElementById('content');
      this.position = this.pageService.getPosition();


      if (this.position && (this.position.pageName == 'searchInStock' || this.position.pageName == 'searchToOrder' )) {

            this.selectedTab = this.position.pageName == 'searchInStock' ? 0 : 1;
            this.pageName = this.position.pageName;
      }



    this.route.queryParams?.pipe(
      takeUntil(this.destroySubject),
    ).subscribe((params: any) => {
      this.selectedTab = params.tab ? params.tab : 0;
      this.search = params.query.replace("%20", " ");
      this.find(false);
    });

    this.informationService.getFrontParams().pipe(
          takeUntil(this.destroySubject),
        )
          .subscribe(
            (res: any) => {
                  this.deliveryWarningText = res.results.find ((value:any) =>  value.name == 'deliveryWarningText')?.value;
            })

    this.pageService.pageEvent.subscribe((event) => {

          if (event == 'pagination') {
            this.position.scrollPosition = 0;
          }
        })
  }

  ngOnDestroy() {
    this.destroySubject.next();

    this.pageService.setPagePosition({
          pageName: this.selectedTab == 0 ? 'searchInStock' : 'searchToOrder',
          pagination: this.selectedTab == 0 ? this.productsInStock.page : this.productsToOrder.page,
          scrollPosition: this.content?.scrollTop,
          pageHeight: this.content ? this.content.scrollHeight : 0

        })
  }



    ngAfterContentChecked() {
      this.position = this.pageService.getPosition();

      if (this.content && this.position.pageName == this.pageName && this.content.scrollHeight >= this.position.pageHeight) {

        this.content.scrollTop = this.position.scrollPosition;
        this.position = new PagePosition({});

      }


    }

    setBasePosition() {
        this.pageService.setBasePosition();
    }

    setQueryParams() {
        this.location.replaceState("/search?query=" + this.search + "&tab=" + this.selectedTab);
    }


  find(setBasePosition: boolean) {

     if (setBasePosition) {
        this.pageService.setBasePosition();
    }


      this.productsInStock?.change(0);
      this.productsToOrder?.change(0);

    this.setQueryParams() ;

  }
}
