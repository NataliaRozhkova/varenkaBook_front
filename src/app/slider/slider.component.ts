import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import KeenSlider from "keen-slider";
import {Slide} from "../model/models";
import {inputNames} from "@angular/cdk/schematics";

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.less']
})
export class SliderComponent implements OnDestroy,OnInit  {

  @ViewChild("sliderRef") sliderRef: ElementRef<HTMLElement>
  currentSlide: number = 0
  dotHelper: Array<Number> = []
  slider: KeenSlider ;

  @Input()
  slides: Slide[] = []

  ngOnInit() {
    setTimeout(() => {
      this.slider = new KeenSlider(this.sliderRef.nativeElement, {
        initial: this.currentSlide,
        slideChanged: (s) => {
          this.currentSlide = s.details().relativeSlide
        },
      })
      this.dotHelper = [...Array(this.slider.details().size).keys()]
    })
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy()
  }


}
