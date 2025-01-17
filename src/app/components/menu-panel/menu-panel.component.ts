import {Component, EventEmitter, Input, OnDestroy, Output, TemplateRef, ViewChild} from '@angular/core';
import {map, Subject, switchMap, takeUntil} from "rxjs";
import {ProductService} from "../../services/product.service";
import {Genre, Product} from "../../model/product";
import {FrontParam} from "../../model/service-information";
import {Router} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {MatDialog} from "@angular/material/dialog";
import {NoopScrollStrategy} from "@angular/cdk/overlay";

@Component({
  selector: 'menu-panel',
  templateUrl: './menu-panel.component.html',
  styleUrls: ['./menu-panel.component.less']
})
export class MenuPanelComponent implements OnDestroy{

  private destroySubject: Subject<void> = new Subject();
  productsCount: number = 0;
  hidden: boolean = true;

  showFind: boolean = false;

  @ViewChild('dialog') myDialog = {} as TemplateRef<string>;
  private dialogRef: any;

  constructor(
    private cartService: CartService,
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.productsCount = this.cartService.getCartCount();

    this.hidden = this.productsCount == 0;

  }

  ngOnInit() {

    this.cartService.cartChange.pipe(
      takeUntil(this.destroySubject))
      .subscribe((next) => {
        this.productsCount = this.cartService.getCartCount();
        this.hidden = this.productsCount == 0;
      })
  }

  openCartPage() {
    this.router.navigate(['cart'])

  }

  ngOnDestroy() {
    this.destroySubject.next();
  }

  closePanel() {
    this.dialog.closeAll()
  }

  showFindPanel($event: boolean) {

    if ($event) {
      this.dialogRef = this.dialog.open(this.myDialog,
        {
          data: 123, height: '50px', width: '90%',
          scrollStrategy: new NoopScrollStrategy(),
          disableClose: true,
          position:{top: '30px'}


        });
      this.dialogRef.disableClose = true;

    } else  {
      this.closePanel();
    }


    this.showFind = $event;


  }


}
