import {Component, Input, OnDestroy,  TemplateRef, ViewChild} from '@angular/core';
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {CartService} from "../../../services/cart.service";
import {MatDialog} from "@angular/material/dialog";
import {ImageService} from "../../../services/image.service";
import {ProductService} from "../../../services/product.service";
import {CertificateCard} from "../../../model/promo";

@Component({
  selector: 'certificate-cart-item',
  templateUrl: './certificate-cart-item.component.html',
  styleUrls: ['./certificate-cart-item.component.less']
})
export class CertificateCartItemComponent implements OnDestroy{

  private destroySubject: Subject<void> = new Subject();

  @Input()
  certificate: CertificateCard;

  @ViewChild('dialog') myDialog = {} as TemplateRef<string>;

  private dialogRef: any;

  @Input()
  count: number;

  constructor(
    private cartService: CartService,
    public productService: ProductService,
    private router: Router,
    public dialog: MatDialog,
    public imageService: ImageService,
  ) {
  }

  ngOnInit() {
  }

  increaseCount() {
    this.cartService.addCertificatesToCart(this.certificate);
  }

  decreaseCount(count: number = 1) {

    this.cartService.deleteCertificateFromCart(this.certificate, count);
  }

  checkCount($event: any): boolean{
    return false
  }

  changeCount($event: any) {

    let countOrder = $event;


    this.cartService.setCertificateCount(this.certificate, countOrder)
  }

  openCertificateInfo(){
    this.router.navigate(['certificate-info', this.certificate.id ])
  }


  deleteAll() {

    this.dialogRef = this.dialog.open(this.myDialog,
      {
        data: 123, height: '350px', width: '250px',
      });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.cartService.deleteCertificateFromCart(this.certificate, this.count);
      }
    });

  }


  ngOnDestroy() {
    this.destroySubject.next();
  }


}
