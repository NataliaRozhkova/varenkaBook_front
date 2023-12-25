import {Component, HostListener, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MenuService} from "../services/menu.service";

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  animations: [
    trigger('expandedPanel', [
      state('initial', style({height: 0, overflow: "hidden" })),
      state('expanded', style({height: '150px'})),
      transition('initial <=> expanded', animate('0.5s')),
    ]),

  ],

})
export class HeaderComponent implements OnInit {
  menuActive: boolean = true;
  screenWidth: number = 0;
  isExpanded: boolean = false

  state: string = 'initial';
  constructor(private menuService: MenuService) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    if (this.screenWidth <= 550) {
      this.menuActive = false;
    } else {
      this.menuActive = true;
    }

  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 550) {
      this.menuActive = false;
    } else {
      this.menuActive = true;
    }

  }

  showMenu() {
    this.isExpanded = !this.isExpanded;
    this.state = this.isExpanded ? 'expanded' : 'initial'

  }


}
