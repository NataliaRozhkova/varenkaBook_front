import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {Observable} from "rxjs";
import {Product} from "../model/product";
import {Order} from "../model/order";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpService) {
  }

  getAvailabilities(): Observable<any> {
    return this.http.get('api/availabilities/', '')
  }

  getProductTypes(): Observable<any> {
    return this.http.get('api/product_types/', '')
  }

  getGenres(): Observable<any> {
    return this.http.get('api/genres/', {'limit':15})
  }


  getProductInfo(id: any): Observable<Product>  {
    return this.http.get(`api/products/${id}/`,{} )
  }

  getProducts(params: any): Observable<Product> {
    return this.http.get(`api/products/`, params)
  }

  createOrder(order: Order): Observable<any> {
    return this.http.post('api/orders/', order)
  }


  getDeliveryTypes(): Observable<any> {
    return this.http.get('api/delivery_types/', '')
  }
  getPickPoints(): Observable<any> {
    return this.http.get('api/pick_points/', '')
  }

  roundPrice(price: number) : number {
    return  parseFloat(price.toFixed(2));
  }
  roundPriceStr(price: number) : string {
    return   price.toFixed(2);
  }


}
