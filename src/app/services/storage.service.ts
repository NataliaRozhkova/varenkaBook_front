import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  setItem(item: any, name: string) {
    sessionStorage.setItem(name, JSON.stringify(item));
  }

  getItemJSON(name: string): string | null {
    return sessionStorage.getItem(name);
  }

  getItem(name: string, nullableValue: string): any {

    return JSON.parse(sessionStorage.getItem(name) || nullableValue);
  }

  clear() {
    sessionStorage.clear();
  }

  deleteItem(name:string) {
    sessionStorage.removeItem(name);
  }


}
