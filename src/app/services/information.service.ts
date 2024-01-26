import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {Observable} from "rxjs";
import {shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  private frontParams: Observable<any>;


  constructor(private http: HttpService) {

  }

  getFrontParams() {
    if (!this.frontParams) {
      this.frontParams = this.http.get('api/front_params/', '').pipe(
        shareReplay(1)
      );
    }
    return this.frontParams;
  }

  subscribeNewsletters(params: any): Observable<any> {
    return this.http.post('api/customers/', params);
  }

  unsubscribeNewsletters(id: string, params: any): Observable<any> {
    return this.http.patch(`api/customers/${id}/`, params);
  }

  getCustomerInfo(params: any): Observable<any> {
    return this.http.get('api/customers/', params)
  }

}
