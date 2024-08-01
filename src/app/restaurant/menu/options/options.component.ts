import { Component } from '@angular/core';

import { TypeUrl } from '../../../core/interfaces/type-url';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})

export class OptionsComponent {
  public defaultUrl: string = 'restaurant/menu/list';

  public types: Array<TypeUrl> = [
    {
      id: 1,
      name: 'Entradas',
      url: `${this.defaultUrl}#entradas`,
    },
    {
      id: 2,
      name: 'Fuertes',
      url: `${this.defaultUrl}#fuertes`,
    },
    {
      id: 3,
      name: 'Bebidas',
      url: `${this.defaultUrl}#bebidas`,
    },
  ];
}
