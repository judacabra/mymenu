import { CompaniesInfo } from '@core/interfaces/company';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { NavbarDashboardComponent } from './navbar/navbar.component';
import { SidebarDashboardComponent } from './sidebar/sidebar.component';
import { FooterDasboardComponent } from './footer/footer.component';

import { CompanyService } from '@services/company/company.service';
import { ViewTitle } from '@core/types/views';
import { Subscription } from 'rxjs';
import { AlertService } from '@services/alertService/alert.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        NavbarDashboardComponent,
        SidebarDashboardComponent,
        FooterDasboardComponent,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})

export default class DashboardComponent implements OnInit, OnDestroy {
    public title: ViewTitle = "Dashboard";

    private querySub: Subscription | undefined;

    public companiesInfo: CompaniesInfo = {
        total: 0,
        active: 0,
        inactive: 0,
        porcent_active: 0,
        porcent_inactive: 0,
    }

    constructor (
        private companyService: CompanyService,
        private alertService: AlertService, 
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.getCompaniesInfo();
    }

    ngOnInit() {
        this.actionValidator();
    }

    private actionValidator(): void {
        this.querySub = this.route.queryParams.subscribe((params) => {
            const changedPassword = String(params['changedPassword'] || '').trim();

            if (!changedPassword || changedPassword === '') return;

            this.router.navigate([], {
                relativeTo: this.route,
                replaceUrl: true,
                queryParams: {}, 
            });

            let msj: string = `Contraseña actualizada exitosamente`;
            
            this.alertService.notification(msj);
        });
    }

    public getCompaniesInfo():void {
        this.companyService.getCompaniesInfo().subscribe({
            next: (response: any) => {
                this.setDashboardInfo(response);
            },
            error: (error: any) => { 
                console.error("Error: " + error)
            }
        })
    }

    public setDashboardInfo(data: any):void {
        this.companiesInfo.total = data.total;
        this.companiesInfo.active = data.active;
        this.companiesInfo.inactive = data.total - data.active;
        this.companiesInfo.porcent_active = Math.round((data.active / data.total) * 100);
        this.companiesInfo.porcent_inactive = Math.round((this.companiesInfo.inactive / data.total) * 100);
    }

    ngOnDestroy() {
        if (this.querySub) {
            this.querySub.unsubscribe();
        }
    }
}
