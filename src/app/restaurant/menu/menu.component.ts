import { Component } from '@angular/core';

import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { OptionsComponent } from './options/options.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    OptionsComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})

export default class MenuComponent {
  
}
