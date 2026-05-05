import { ChangeDetectorRef, Component } from '@angular/core';

import { FooterDasboardComponent } from '../../footer/footer.component';
import { NavbarDashboardComponent } from '../../navbar/navbar.component';
import { SidebarDashboardComponent } from '../../sidebar/sidebar.component';

import { Company } from '@core/interfaces/company';

import { CompanyService } from '@services/company/company.service';
import { CommonModule } from '@angular/common';
import { ViewTitle } from '@core/types/views';
import { Mode } from '@core/interfaces/mode';
import { Subscription } from 'rxjs';
import { AlertService } from '@services/alertService/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TableContent, TableTitle } from '@core/interfaces/table';
import { TableComponent } from 'src/app/shared/table/table.component';
import { FormCompanyComponent } from './form/form.component';

@Component({
    selector: 'app-company',
    standalone: true,
    imports: [
        NavbarDashboardComponent,
        SidebarDashboardComponent,
        FooterDasboardComponent,
        FormCompanyComponent,
        TableComponent,
        CommonModule,
    ],
    templateUrl: './companies.component.html',
    styleUrl: './companies.component.css'
})

export default class CompaniesComponent {
    public title: ViewTitle = "Empresas";

    public mode: Mode = {
        action: '',
        actioner: '',
    }

    private querySub: Subscription | undefined;

    private initialCompany: Company = {
        id: 0,
        name: '',
        description: '',
        nit: 0,
        active: false,
    }

    public company: Company = this.initialCompany;

    public tableContent: TableContent[] = [];

    public tableTitles: TableTitle[] = [
        { name: "NOMBRE", classes: "w-20 rnd-first-top" },
        { name: "DESCRIPCION", classes: "text-start w-40" },
        { name: "IMAGEN", classes: "text-center w-15" },
        { name: "ESTADO", classes: "text-center w-15" },
        { name: "", classes: "text-center w-10 rnd-last-top" },
    ];

    public companies: Company[] = [];
    public filteredCompanies: Company[] = [];
    public paginatedCompanies: Company[] = [];
    public originalCompanies: Company[] = [];

    public columnsCount: number = 5;
    public currentPage: number = 1;
    public rowsPerPage: number = 7;
    public totalPages: number = 0;
    public pages: number[] = [];

    constructor(
        private companyService: CompanyService,
        private alertService: AlertService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
    ) {
        this.getCompanies();
    }

    ngOnInit() {
        this.actionValidator();
    }

    private loadCompanies(): void {
        this.filteredCompanies = [...this.companies];

        this.updatePagination();
    }

    public getCompanies(): void {
        this.companyService.consultCompanies().subscribe({
            next: (response) => {
                this.companies = response;
                this.loadCompanies();
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    }

    public updatePagination(): void {
        const start: number = (this.currentPage - 1) * this.rowsPerPage;
        const end: number = Math.min(start + this.rowsPerPage, this.filteredCompanies.length);

        this.paginatedCompanies = this.filteredCompanies.slice(start, end);
        this.totalPages = Math.ceil(this.filteredCompanies.length / this.rowsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

        this.tableContent = [];
        this.paginatedCompanies.forEach((c: Company) => {
            const objProduct: TableContent = {
                columns: [
                    { id: c.id!.toString(), label: c.name, classes: 'text-start' },
                    { id: c.id!.toString(), label: c.description, classes: 'text-start' },
                    { id: c.id!.toString(), label: c.img?.toString() || '', classes: 'text-center' },
                    { id: c.id!.toString(), label: c.active?.toString() || '', classes: 'text-center' },
                ],
                editRow: true,
                deleteRow: false,
                idForm: "companiesForm",
                onEdit: () => this.setMode('Modificar', c.id!),
            };

            this.tableContent.push(objProduct);
        });

        this.cdr.markForCheck();
    }

    public changePage = (page: number): void => {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;

        this.updatePagination();
    }

    public setMode(mode: string, id?: number): void {
        if (mode == 'Insertar') {
            this.mode.action = 'Nueva';
            this.mode.actioner = 'Insertar';

            this.company = this.initialCompany;
        }

        if (mode == 'Modificar') {
            if (id) this.getCompanyById(id);

            this.mode.action = 'Actualizar';
            this.mode.actioner = 'Modificar';
        }
    }

    public searchCompany(event: Event): void {
        const inputElement: HTMLInputElement = event.target as HTMLInputElement;
        const searchValue: string = inputElement.value.trim();

        if (!searchValue || searchValue == "") {
            this.filteredCompanies = [...this.companies];
        } else {
            this.filteredCompanies = this.companies.filter(c => {
                const matchById: boolean = !isNaN(Number(searchValue)) && c.id === Number(searchValue);
                const matchByName: boolean = c.name.toLowerCase().includes(searchValue.toLowerCase());

                return matchById || matchByName;
            });
        }

        this.currentPage = 1;

        this.updatePagination();
    }

    public async verifyDeleteProduct(id: number): Promise<void> {
        if (await this.alertService.confirm(`Seguro que desea eliminar el producto #${id}?`)) {
            this.tryDeleteCompany(id);
        }
    }

    private tryDeleteCompany(id: number): void {
        // this.companyService.deleteCompanyById(id).subscribe({
        //     next: () => {
        //         window.location.reload();
        //     },
        //     error: (error: any) => {
        //         console.error("Error: ", error);
        //     }
        // });
    }

    public getCompanyById(id: number): void {
        this.companyService.getCompanyByParam(id).subscribe({
            next: (response: any) => {
                this.company = response;
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        });
    }

    private actionValidator(): void {
        this.querySub = this.route.queryParams.subscribe((params) => {
            const created = String(params['created'] || '').trim();
            const updated = String(params['updated'] || '').trim();
            const failed = created == '0' || updated == '0';

            if (
                (!created || created === '') &&
                (!updated || updated === '')
            ) return;

            this.getCompanies();

            this.closeModal();

            this.router.navigate([], {
                relativeTo: this.route,
                replaceUrl: true,
                queryParams: {},
            });

            let msj: string = `Empresa ${created ? 'creada' : 'actualizada'} exitosamente`;
            if (failed) msj = `Error al ${created ? 'crear' : 'actualizar'} la empresa.`

            this.alertService.notification(msj, !failed);
        });
    }

    public closeModal(): void {
        document.getElementById('close-modal')!.click();
    }

    ngOnDestroy() {
        if (this.querySub) {
            this.querySub.unsubscribe();
        }
    }
}
