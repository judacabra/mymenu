import { Component } from '@angular/core';

import { NavbarDashboardComponent } from './navbar/navbar.component';
import { FooterDasboardComponent } from './footer/footer.component';
import { SidebarDashboardComponent } from './sidebar/sidebar.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        NavbarDashboardComponent,
        SidebarDashboardComponent,
        FooterDasboardComponent,
        DashboardComponent,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})

export default class DashboardComponent {

}
