import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import KeenSlider from "keen-slider";
import {Slide} from "../../model/models";

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.less',
    "../../../../node_modules/keen-slider/keen-slider.min.css",
  ]
})
export class SliderComponent implements OnDestroy,  OnInit, AfterViewInit {

  @ViewChild("sliderRef") sliderRef: ElementRef<HTMLElement>
  currentSlide: number = 0
  dotHelper: Array<Number> = []
  slider: KeenSlider;

  @Input()
  slidesArray: Slide[] = []
  hideSlider: boolean = true;

  @Input()
  timeOut: number = 100;

  @Input()
  initialSlider: number = 0;

  @Input()
  shadow: boolean = false;

  imageStyle: any = {'visibility': 'hidden'};

  ngOnInit() {
    //window.dispatchEvent(new Event('resize'));
    this.initSlider();
  }


  ngAfterViewInit(): void {
    //this.initSlider();
  }


  initSlider() {
    setTimeout(() => {
      this.slider = new KeenSlider(this.sliderRef.nativeElement, {
        initial: this.initialSlider,
        mode: "snap",

        slideChanged: (s) => {
          this.currentSlide = s.details().relativeSlide
        },
        loop: true,

      });
      this.dotHelper = [...Array(this.slider.details().size).keys()]
      this.imageStyle  = {};

    }, this.timeOut)
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy()
  }

  refresh() {
    this.slider.destroy()
    this.currentSlide = 0;
    this.slider.refresh()
  }

}
