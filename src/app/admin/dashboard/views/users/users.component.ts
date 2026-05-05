import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarDashboardComponent } from '../../navbar/navbar.component';
import { SidebarDashboardComponent } from '../../sidebar/sidebar.component';
import { FooterDasboardComponent } from '../../footer/footer.component';

import { User } from '@core/interfaces/user';

import { UserService } from '@services/user/user.service';
import { ViewTitle } from '@core/types/views';
import { TableComponent } from 'src/app/shared/table/table.component';
import { TableContent, TableTitle } from '@core/interfaces/table';
import { FormUserComponent } from './form/form.component';
import { Subscription } from 'rxjs';
import { Mode } from '@core/interfaces/mode';
import { AlertService } from '@services/alertService/alert.service';
import { ProfileService } from '@services/profile/profile.service';
import { Profile } from '@core/interfaces/profile';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        NavbarDashboardComponent,
        SidebarDashboardComponent,
        FooterDasboardComponent,
        FormUserComponent,
        CommonModule,
        TableComponent,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css'
})

export default class UsersComponent implements OnInit, OnDestroy {
    public title: ViewTitle = "Usuarios";

    public mode: Mode = {
        action: '',
        actioner: '',
    }

    private querySub: Subscription | undefined;

    private initialUser: User = {
        id: 0,
        name: '',
        email: '',
        username: '',
        id_profile: 0,
        active: false,
    }

    public user: User = this.initialUser;

    public tableContent: TableContent[] = [];
    
    public tableTitles: TableTitle[] = [
        { name: "NOMBRE", classes: "w-20 rnd-first-top" },
        { name: "USUARIO", classes: "text-center w-20" },
        { name: "EMAIL", classes: "text-center w-20" },
        { name: "PERFIL", classes: "text-center w-15" },
        { name: "EMPRESA", classes: "text-center w-15" },
        { name: "ESTADO", classes: "text-center w-10" },
        { name: "", classes: "text-center w-10 rnd-last-top" },
    ];

    public profiles: Profile[] = [];

    public users: User[] = [];
    public filteredUsers: User[] = [];
    public originalUsers: User[] = [];
    public paginatedUsers: User[] = [];

    public columnsCount: number = 7;
    public currentPage: number = 1;
    public rowsPerPage: number = 8;
    public totalPages: number = 0;
    public pages: number[] = [];

    public userId: number;

    constructor(
        private userService: UserService,
        private alertService: AlertService,
        private profileService: ProfileService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.userId = Number(sessionStorage.getItem('user_id'));

        this.getUsers(this.userId);
        this.updatePagination();

        this.getProfiles();
    }

    ngOnInit() {
        this.actionValidator();
    }

    private getProfiles(): void {
        this.profileService.consultProfiles().subscribe({
            next: (response: any) => {
                this.profiles = response;
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        });
    }

    private loadUsers(): void {
        this.filteredUsers = [...this.users];

        this.updatePagination();
    }

    private getUsers(id: number): void {
        this.userService.consultUsers(id).subscribe({
            next: (response: any) => {
                this.users = response;

                this.loadUsers();
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        });
    }

    public updatePagination(): void {
        const start: number = (this.currentPage - 1) * this.rowsPerPage;
        const end: number = Math.min(start + this.rowsPerPage, this.filteredUsers.length);

        this.paginatedUsers = this.filteredUsers.slice(start, end);
        this.totalPages = Math.ceil(this.filteredUsers.length / this.rowsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

        this.tableContent = [];
        this.paginatedUsers.forEach((u: User) => {
            const objUser: TableContent = {
                columns: [
                    { label: u.name, classes: '' },
                    { label: u.username, classes: 'text-center' },
                    { label: u.email, classes: 'text-center' },
                    { label: u.profile_name || '', classes: 'text-center' },
                    { label: u.company_name || '', classes: 'text-center' },
                    { label: u.active.toString() || 'false', classes: 'text-center' },
                ],
                editRow: true,
                deleteRow: true,
                idForm: "usersForm",
                onEdit: () => this.setMode('Modificar', u.id!),
                onDelete: () => this.verifyDeleteProduct(u.id!),
            };

            this.tableContent.push(objUser);
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

            this.user = this.initialUser;
        }

        if (mode == 'Modificar') {
            if (id) this.getUserById(id);

            this.mode.action = 'Actualizar';
            this.mode.actioner = 'Modificar';
        }
    }

    public searchUser(event: Event): void {
        const inputElement: HTMLInputElement = event.target as HTMLInputElement;
        const searchValue: string = inputElement.value.trim();

        if (!searchValue || searchValue == "") {
            this.filteredUsers = [...this.users];
        } else {
            this.filteredUsers = this.users.filter(u => {
                const matchById: boolean = !isNaN(Number(searchValue)) && u.id === Number(searchValue);
                const matchByName: boolean = u.name.toLowerCase().includes(searchValue.toLowerCase());

                return matchById || matchByName;
            });
        }

        this.currentPage = 1;

        this.updatePagination();
    }

    public async verifyDeleteProduct(id: number): Promise<void> {
        if (await this.alertService.confirm(`Seguro que desea eliminar el usuario #${id}?`)) {
            this.tryDeleteUser(id);
        }
    }

    private tryDeleteUser(id: number): void {
        // this.userService.deleteUserById(id).subscribe({
        //     next: () => {
        //         window.location.reload();
        //     },
        //     error: (error: any) => {
        //         console.error("Error: ", error);
        //     }
        // });
    }

    public getUserById(id: number): void {
        this.userService.getUserById(id).subscribe({
            next: (response: any) => {
                this.user = response;
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        });
    }

    public closeModal(): void { 
        this.user = this.initialUser;
        
        document.getElementById('close-modal')!.click();
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

            this.getUsers(this.userId);

            this.closeModal();

            this.router.navigate([], {
                relativeTo: this.route,
                replaceUrl: true,
                queryParams: {},
            });

            let msj: string = `Usuario ${created ? 'creado' : 'actualizado'} exitosamente`;
            if (failed) msj = `Error al ${created ? 'crear' : 'actualizar'} el usuario.`
            
            this.alertService.notification(msj, !failed);
        });
    }

    ngOnDestroy() {
        if (this.querySub) {
            this.querySub.unsubscribe();
        }
    }
}
