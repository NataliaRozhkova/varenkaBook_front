import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  get(url:string, params:any):Observable<any> {
    return this.http.get( url,  {params: params, headers: this.createAuthorizationHeader() })
  }

  post(url:string, params:any):Observable<any> {
    return this.http.post( url,  params , {headers: this.createAuthorizationHeader() })
  }

  patch(url:string, params:any):Observable<any> {
    return this.http.patch( url,  params , {headers: this.createAuthorizationHeader() })
  }

  createAuthorizationHeader(): any {
      return {'Authorization': 'Basic ' +
        btoa('webapp_123456789')};
    }


}
