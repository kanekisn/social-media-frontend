import {Component, Input} from '@angular/core';

@Component({
  selector: 'svg[icon]',
  template: '<svg:use [attr.xlink:href]="href"></svg:use>',
  styles: [''],
  standalone: true
})
export class SvgIconComponent {
  @Input() icon = '';

  get href() {
    return `assets/svg/${this.icon}.svg#${this.icon}`;
  }
}
