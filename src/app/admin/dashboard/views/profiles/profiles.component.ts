import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarDashboardComponent } from '../../navbar/navbar.component';
import { SidebarDashboardComponent } from '../../sidebar/sidebar.component';
import { FooterDasboardComponent } from '../../footer/footer.component';

import { ProfileService } from '@services/profile/profile.service'
import { Profile } from '@core/interfaces/profile';
import { ViewTitle } from '@core/types/views';
import { TableContent, TableTitle } from '@core/interfaces/table';
import { TableComponent } from 'src/app/shared/table/table.component';
import { AlertService } from '@services/alertService/alert.service';
import { Mode } from '@core/interfaces/mode';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormProfileComponent } from './form/form.component';

@Component({
    selector: 'app-profiles',
    standalone: true,
    imports: [
        NavbarDashboardComponent,
        SidebarDashboardComponent,
        FooterDasboardComponent,
        FormProfileComponent,
        CommonModule,
        TableComponent,
    ],
    templateUrl: './profiles.component.html',
    styleUrl: './profiles.component.css',
})

export default class ProfilesComponent implements OnInit {
    public title: ViewTitle = "Perfiles";

    public mode: Mode = {
        action: '',
        actioner: '',
    }

    private querySub: Subscription | undefined;

    private initialProfile: Profile = {
        id: 0,
        name: '',
        description: '',
    }

    public profile: Profile = this.initialProfile;

    public tableContent: TableContent[] = [];

    public tableTitles: TableTitle[] = [
        { name: "NOMBRE", classes: "w-40 rnd-first-top" },
        { name: "DESCRIPCION", classes: "text-start w-40" },
        { name: "", classes: "text-center w-10 rnd-last-top" },
    ];

    public profiles: Profile[] = [];
    public filteredProfiles: Profile[] = [];
    public paginatedProfiles: Profile[] = [];
    public originalProfiles: Profile[] = [];

    public columnsCount: number = 3;
    public currentPage: number = 1;
    public rowsPerPage: number = 7;
    public totalPages: number = 0;
    public pages: number[] = [];

    constructor(
        private profileService: ProfileService,
        private alertService: AlertService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.getProfiles();
    }

    ngOnInit() {
        this.actionValidator();
    }

    private loadProfiles(): void {
        this.filteredProfiles = [...this.profiles];

        this.updatePagination();
    }

    public getProfiles(): void {
        this.profileService.consultProfiles().subscribe({
            next: (response) => {
                this.profiles = response;
                this.loadProfiles();
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    }

    public updatePagination(): void {
        const start: number = (this.currentPage - 1) * this.rowsPerPage;
        const end: number = Math.min(start + this.rowsPerPage, this.filteredProfiles.length);

        this.paginatedProfiles = this.filteredProfiles.slice(start, end);
        this.totalPages = Math.ceil(this.filteredProfiles.length / this.rowsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

        this.tableContent = [];
        this.paginatedProfiles.forEach((p: Profile) => {
            const objProfile: TableContent = {
                columns: [
                    { id: p.id!.toString(), label: p.name, classes: 'text-start' },
                    { id: p.id!.toString(), label: p.description || ' - ', classes: 'text-start' },
                ],
                editRow: true,
                deleteRow: false,
                idForm: "profilesForm",
                onEdit: () => this.setMode('Modificar', p.id!),
                onDelete: () => this.verifyDeleteProduct(p.id!),
            };

            this.tableContent.push(objProfile);
        });
    }

    public changePage = (page: number): void => {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;

        this.updatePagination();
    }

    public setMode(mode: string, id?: number): void {
        if (mode == 'Insertar') {
            this.mode.action = 'Nuevo';
            this.mode.actioner = 'Insertar';

            this.profile = this.initialProfile;
        }

        if (mode == 'Modificar') {
            if (id) this.getProfileById(id);

            this.mode.action = 'Actualizar';
            this.mode.actioner = 'Modificar';
        }
    }

    public searchProfile(event: Event): void {
        const inputElement: HTMLInputElement = event.target as HTMLInputElement;
        const searchValue: string = inputElement.value.trim();
        
        if (!searchValue || searchValue == "") {
            this.filteredProfiles = [...this.profiles];
        } else {
            this.filteredProfiles = this.profiles.filter(product => {
                const matchById: boolean = !isNaN(Number(searchValue)) && product.id === Number(searchValue);
                const matchByName: boolean = product.name.toLowerCase().includes(searchValue.toLowerCase());

                return matchById || matchByName;
            });
        }
        
        this.currentPage = 1;

        this.updatePagination();
    }

    public getProfileById(id: number): void {
        this.profileService.consultProfileById(id).subscribe({
            next: (response: any) => {
                this.profile = response;
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        });
    }

    public async verifyDeleteProduct(id: number): Promise<void> {
        if (await this.alertService.confirm(`Seguro que desea eliminar el perfil #${id}?`)) {
            // this.tryDeleteProfile(id);
        }
    }

    private actionValidator(): void {
        this.querySub = this.route.queryParams.subscribe((params) => {
            const created = String(params['created'] || '').trim();
            const updated = String(params['updated']|| '').trim();
            const failed = created == '0' || updated == '0';

            if (
                (!created || created === '') &&
                (!updated || updated === '')
            ) return;

            this.getProfiles();

            this.closeModal();

            this.router.navigate([], {
                relativeTo: this.route,
                replaceUrl: true,
                queryParams: {},
            });

            let msj: string = `Perfil ${created ? 'creado' : 'actualizado'} exitosamente`;
            if (failed) msj = `Error al ${created ? 'crear' : 'actualizar'} el perfil.`
            
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
