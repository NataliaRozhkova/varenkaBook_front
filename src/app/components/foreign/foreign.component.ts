import {Component, OnInit, ViewChild } from '@angular/core';
import {ProductPageComponent} from "../product-page/product-page.component";

@Component({
  selector: 'foreign',
  templateUrl: './foreign.component.html',
  styleUrls: ['./foreign.component.less']
})
export class ForeignComponent {

    @ViewChild('products')
    products: ProductPageComponent;

    ngOnInit() {

         let contentElement = document.getElementById('foreignMenuItem');
         contentElement?.addEventListener('click',  () => {

            this.products.rejectFilters();

         })

     }


}
