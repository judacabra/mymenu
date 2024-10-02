import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarDashboardComponent } from '../../navbar/navbar.component';
import { SidebarDashboardComponent } from '../../sidebar/sidebar.component';
import { FooterDasboardComponent } from '../../footer/footer.component';

import { User } from '@core/interfaces/user';

import { UserService } from '@services/user/user.service';
import { UserLogged } from '@core/interfaces/user_logged';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        NavbarDashboardComponent,
        SidebarDashboardComponent,
        FooterDasboardComponent,
        CommonModule,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css'
})

export default class UsersComponent {
    public users: User[] = [];
    public paginatedUsers: User[] = []; 
    public currentPage = 1;
    public rowsPerPage = 8;
    public totalPages = 0;
    public pages: number[] = [];

    public user_logged: UserLogged = {
        id: 0,
        name: '',
        email: '',
        company_name: '',
        profile_name: '',
        permissions: [
            {
                id: 0,
                name: '',
            },
        ],
    }

    constructor(private userService: UserService) {
        this.getUsers(Number(sessionStorage.getItem('user_id')));
        this.updatePagination();
    }

    public getUsers(user_id: number): void {
        this.userService.consultUsers(user_id).subscribe({
            next: (response) => {
                this.users = response;
                this.updatePagination();
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    }

    public updatePagination() {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        const end = Math.min(start + this.rowsPerPage, this.users.length);
        this.paginatedUsers = this.users.slice(start, end);
        this.totalPages = Math.ceil(this.users.length / this.rowsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    public changePage(page: number) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.updatePagination();
    }
}
