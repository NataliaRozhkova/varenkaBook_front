import {Component, Input} from '@angular/core';
import {MenuService} from "../../services/menu.service";

@Component({
  selector: 'page-menu-item',
  templateUrl: './page-menu-item.component.html',
  styleUrls: ['./page-menu-item.component.less']
})
export class PageMenuItemComponent {

  @Input()
  imageUrl: string;

  @Input()
  menuItemName: string;

  @Input()
  pageLink: string;


  constructor() {
  }


}
