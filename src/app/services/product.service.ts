import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {Observable, retry} from "rxjs";
import {Product} from "../model/product";
import {CertificatesOrder, Order} from "../model/order";

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
    return this.http.get('api/genres/', {'limit': 15})
  }

  getAgeCategories(): Observable<any> {
    return this.http.get('api/age_categories/', {'limit': 15})
  }


  getProductInfo(id: any): Observable<Product> {
    return this.http.get(`api/products/${id}/`, {})
  }

  getProducts(params: any): Observable<Product> {
    return this.http.get(`api/products/`, params)
  }

  saveOrder(order: Order): Observable<any> {
    return this.http.post('api/orders/', order)
  }

  changeOrder( params: any) {
    return this.http.patch(`api/orders/`, params);
  }

  cancelOrder( id: any) {
    return this.http.get(`api/cancel/`, {id: id});
  }


  getDeliveryTypes(): Observable<any> {
    return this.http.get('api/delivery_types/', '')
  }

  getCertificateTypes(id: any): Observable<any> {
    return this.http.get(`api/certificate_types/${id}/`, { })
  }

  saveCertificateOrder(order: CertificatesOrder): Observable<any> {
    return this.http.post('api/certificate_orders/', order)
  }

  getPickPoints(): Observable<any> {
    return this.http.get('api/pick_points/', '')
  }

  roundPrice(price: number): number {
    return parseFloat(price.toFixed(2));
  }

  roundPriceStr(price: number): string {
    return price.toFixed(2);
  }

  phoneValidate(phoneNumber: string): Observable<any> {
    return this.http.get('api/validate_phone/', {phone: phoneNumber})
  }


}
