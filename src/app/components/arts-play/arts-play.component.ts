import {Component, OnInit, ViewChild } from '@angular/core';
import {ProductPageComponent} from "../product-page/product-page.component";

@Component({
  selector: 'arts-play',
  templateUrl: './arts-play.component.html',
  styleUrls: ['./arts-play.component.less']
})
export class ArtsPlayComponent implements OnInit  {

    @ViewChild('products')
    products: ProductPageComponent;

    ngOnInit() {

         let contentElement = document.getElementById('artsMenuItem');
         contentElement?.addEventListener('click',  () => {

            this.products.rejectFilters();

         })

     }
}
