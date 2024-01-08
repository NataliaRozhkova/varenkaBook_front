import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {Observable} from "rxjs";
import {Product} from "../model/product";

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

  getFrontParams(): Observable<any> {
    return this.http.get('api/front_params/', '')

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
}
