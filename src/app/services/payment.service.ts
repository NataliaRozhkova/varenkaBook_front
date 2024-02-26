import {EventEmitter, Injectable} from '@angular/core';
import {StorageService} from "./storage.service";
import {HttpService} from "./http.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class PaymentService {


  constructor(
    private storageService: StorageService,
    private http: HttpService
  ) {
  }


  createPayment( id: number, params: any,) : Observable<any> {
    return this.http.get(`api/buy/${id}/`, params)
  }
}
