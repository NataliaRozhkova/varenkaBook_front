import {Component, Input} from '@angular/core';
import {Product} from "../../../model/product";
import {Router} from "@angular/router";
import {ImageService} from "../../../services/image.service";
import {CertificateCard} from "../../../model/promo";

@Component({
  selector: 'certificate-item',
  templateUrl: './certificate-item.component.html',
  styleUrls: ['./certificate-item.component.less']
})
export class CertificateItemComponent {

  @Input()
  certificate: CertificateCard;


  constructor(
    private router: Router,
    public imageService: ImageService
  ) {
  }

  ngOnInit(): void {
  }

  openInfo($event: CertificateCard){

    this.router.navigate(['certificate-info', $event.id ])

  }

  }
