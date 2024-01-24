import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {Observable} from "rxjs";
import {News} from "../model/models";
import {Product} from "../model/product";

@Injectable({
  providedIn: 'root'
})
export class NewsService {


  constructor(private http: HttpService) {
  }

  getNews (params: any): Observable<News> {
    return this.http.get(`api/news/`, params)
  }
  getNewsInfo (id: any): Observable<News> {
    return this.http.get(`api/news/${id}/`,{} )
  }

}
