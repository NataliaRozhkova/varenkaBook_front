import {Component, HostListener, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MenuService} from "../../services/menu.service";
import {Router} from "@angular/router";

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  animations: [
    trigger('expandedPanel', [
      state('initial', style({height: 0, overflow: "hidden"})),
      state('expanded', style({height: 200})),
      transition('initial <=> expanded', animate('0.1s')),
    ]),

  ],

})
export class HeaderComponent implements OnInit {
  menuActive: boolean = true;
  screenWidth: number = 0;
  isExpanded: boolean = false

  state: string = 'initial';

  constructor(
    private menuService: MenuService,
    private router: Router
  ) {
    // this.state = 'initial';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    this.menuActive = this.screenWidth > 550;
    this.isExpanded = false;
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.menuActive = this.screenWidth > 550;
  }

  showMenu() {
    if (this.screenWidth < 550) {
      this.isExpanded = !this.isExpanded;
      this.state = this.isExpanded ? 'expanded' : 'initial'
    }

  }

  navigate($event: any) {
    this.showMenu();
    this.router.navigate([$event], {queryParams: {genre: 'all'}})

  }


}
