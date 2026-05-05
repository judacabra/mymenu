import { ChangeDetectorRef, Component } from '@angular/core';

import { FooterDasboardComponent } from '../../footer/footer.component';
import { NavbarDashboardComponent } from '../../navbar/navbar.component';
import { SidebarDashboardComponent } from '../../sidebar/sidebar.component';

import { HeadquarterService } from '@services/headquarter/headquarter.service';
import { CommonModule } from '@angular/common';
import { ViewTitle } from '@core/types/views';
import { Mode } from '@core/interfaces/mode';
import { Subscription } from 'rxjs';
import { AlertService } from '@services/alertService/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TableContent, TableTitle } from '@core/interfaces/table';
import { TableComponent } from 'src/app/shared/table/table.component';
import { FormHeadquarterComponent } from './form/form.component';
import { Headquarter } from '@core/interfaces/headquarter';

@Component({
    selector: 'app-headquarter',
    standalone: true,
    imports: [
        NavbarDashboardComponent,
        SidebarDashboardComponent,
        FooterDasboardComponent,
        FormHeadquarterComponent,
        TableComponent,
        CommonModule,
    ],
    templateUrl: './headquarters.component.html',
    styleUrl: './headquarters.component.css'
})

export default class HeadquartersComponent {
    public title: ViewTitle = "Sedes";

    public mode: Mode = {
        action: '',
        actioner: '',
    }

    private querySub: Subscription | undefined;

    private initialHeadquarter: Headquarter = {
        id: 0,
        name: '',
        description: '',
        address: '',
        active: false,
    }

    public headquarter: Headquarter = this.initialHeadquarter;

    public tableContent: TableContent[] = [];

    public tableTitles: TableTitle[] = [
        { name: "NOMBRE", classes: "w-20 rnd-first-top" },
        { name: "DESCRIPCION", classes: "text-start w-30" },
        { name: "DIRECCION", classes: "text-center w-20" },
        { name: "ESTADO", classes: "text-center w-15" },
        { name: "", classes: "text-center w-10 rnd-last-top" },
    ];

    public headquarters: Headquarter[] = [];
    public filteredHeadquarters: Headquarter[] = [];
    public paginatedHeadquarters: Headquarter[] = [];
    public originalHeadquarters: Headquarter[] = [];

    public columnsCount: number = 5;
    public currentPage: number = 1;
    public rowsPerPage: number = 7;
    public totalPages: number = 0;
    public pages: number[] = [];

    constructor(
        private headquarterService: HeadquarterService,
        private alertService: AlertService,
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
    ) {
        this.getHeadquarters();
    }

    ngOnInit() {
        this.actionValidator();
    }

    private loadHeadquarters(): void {
        this.filteredHeadquarters = [...this.headquarters];

        this.updatePagination();
    }

    public getHeadquarters(): void {
        this.headquarterService.consultHeadquarters().subscribe({
            next: (response) => {
                this.headquarters = response;
                this.loadHeadquarters();
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    }

    public updatePagination(): void {
        const start: number = (this.currentPage - 1) * this.rowsPerPage;
        const end: number = Math.min(start + this.rowsPerPage, this.filteredHeadquarters.length);

        this.paginatedHeadquarters = this.filteredHeadquarters.slice(start, end);
        this.totalPages = Math.ceil(this.filteredHeadquarters.length / this.rowsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

        this.tableContent = [];
        this.paginatedHeadquarters.forEach((c: Headquarter) => {
            const objHeadquarter: TableContent = {
                columns: [
                    { id: c.id!.toString(), label: c.name, classes: 'text-start' },
                    { id: c.id!.toString(), label: c.description, classes: 'text-start' },
                    { id: c.id!.toString(), label: c.address.toString(), classes: 'text-center' },
                    { id: c.id!.toString(), label: c.active.toString(), classes: 'text-center' },
                ],
                editRow: true,
                deleteRow: false,
                idForm: "headquartersForm",
                onEdit: () => this.setMode('Modificar', c.id!),
                // onDelete: () => this.verifyDeleteHeadquarter(c.id!),
            };

            this.tableContent.push(objHeadquarter);
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

            this.headquarter = this.initialHeadquarter;
        }

        if (mode == 'Modificar') {
            if (id) this.getHeadquarterById(id);

            this.mode.action = 'Actualizar';
            this.mode.actioner = 'Modificar';
        }
    }

    public searchHeadquarter(event: Event): void {
        const inputElement: HTMLInputElement = event.target as HTMLInputElement;
        const searchValue: string = inputElement.value.trim();

        if (!searchValue || searchValue == "") {
            this.filteredHeadquarters = [...this.headquarters];
        } else {
            this.filteredHeadquarters = this.headquarters.filter(c => {
                const matchById: boolean = !isNaN(Number(searchValue)) && c.id === Number(searchValue);
                const matchByName: boolean = c.name.toLowerCase().includes(searchValue.toLowerCase());

                return matchById || matchByName;
            });
        }

        this.currentPage = 1;

        this.updatePagination();
    }

    public async verifyDeleteHeadquarter(id: number): Promise<void> {
        if (await this.alertService.confirm(`Seguro que desea eliminar el producto #${id}?`)) {
            this.tryDeleteHeadquarter(id);
        }
    }

    private tryDeleteHeadquarter(id: number): void {
        // this.headquarterService.deleteHeadquarterById(id).subscribe({
        //     next: () => {
        //         window.location.reload();
        //     },
        //     error: (error: any) => {
        //         console.error("Error: ", error);
        //     }
        // });
    }

    public getHeadquarterById(id: number): void {
        this.headquarterService.getHeadquarterById(id).subscribe({
            next: (response: any) => {
                this.headquarter = response;
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

            this.getHeadquarters();

            this.closeModal();

            this.router.navigate([], {
                relativeTo: this.route,
                replaceUrl: true,
                queryParams: {},
            });

            let msj: string = `Sede ${created ? 'creada' : 'actualizada'} exitosamente`;
            if (failed) msj = `Error al ${created ? 'crear' : 'actualizar'} la sede.`

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
