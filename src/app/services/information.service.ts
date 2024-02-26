import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {Observable} from "rxjs";
import {shareReplay} from 'rxjs/operators';
import {environment} from "../../environments/environment";

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

  createPayment(id:number, params: any) : Observable<any> {
    return this.http.get(`api/buy/${id}/`, params)
  }

  getErrorText(errors: any): string {
    let errorText = '';
    Object.keys(errors).forEach((err) => {
      errorText += environment.errors[err as keyof typeof environment.errors]

    })
    return errorText;
  }

}
