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

  subscribe(params: any): Observable<any> {
    return this.http.post('api/customers/', params);
  }

}
