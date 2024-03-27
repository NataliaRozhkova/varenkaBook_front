import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {find, Subject, takeUntil} from "rxjs";
import {CertificateCard} from "../../model/promo";
import {ProductService} from "../../services/product.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: ['./certificate-list.component.less']
})
export class CertificateListComponent implements OnDestroy, OnInit {


  private destroySubject: Subject<void> = new Subject();

  certificateTypes: CertificateCard[] = []
  loading = false;
  certificateImageLink: string;

  constructor(
    private productService: ProductService
  ) {
    this.certificateImageLink = environment.certificateImage;
  }

  ngOnInit() {
    this.getCertificateTypes();

  }

  getCertificateTypes() {

    this.productService.getCertificateTypes('').pipe(
      takeUntil(this.destroySubject)
    ).subscribe((result) => {
      this.certificateTypes = result.results;
      this.certificateTypes.forEach( (cert) => {
        cert.photo = this.certificateImageLink;
      })
    })
  }


  ngOnDestroy() {
    this.destroySubject.next();
  }


}
