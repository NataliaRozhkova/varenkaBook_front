import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, reduce, throwError} from "rxjs";
import {Availability} from "../model/product";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  get(url:string, params:any):Observable<any> {
    return this.http.get( url,  {params: params })
  }

  getTest() {
    // return this.http.get<Availability[]>("");

  }


}
