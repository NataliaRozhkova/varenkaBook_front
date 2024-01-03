import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {Availability} from "../model/product";
import {firstValueFrom, Observable, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpService) {
  }

  getAvailabilities():Observable<any> {

    return  this.http.get('api/availabilities/', '')



    // return ;

  }
}
