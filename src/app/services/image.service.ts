import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() {
  }

  changeImageUrl(imageUrl: string): string {

    if (imageUrl &&imageUrl.indexOf('media') > 0) {
      return '/api/' + imageUrl.substring(imageUrl.indexOf('media'), imageUrl.length);
    } else return imageUrl;
  }


}
