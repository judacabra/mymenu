import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarDashboardComponent } from '../../navbar/navbar.component';
import { SidebarDashboardComponent } from '../../sidebar/sidebar.component';
import { FooterDasboardComponent } from '../../footer/footer.component';

import { ProfileService } from '@services/profile/profile.service'
import { Profile } from '@core/interfaces/profile';

@Component({
    selector: 'app-profiles',
    standalone: true,
    imports: [
        NavbarDashboardComponent,
        SidebarDashboardComponent,
        FooterDasboardComponent,
        CommonModule
    ],
    templateUrl: './profiles.component.html',
    styleUrl: './profiles.component.css',
})

export default class ProfilesComponent {
    public profiles: Profile[] = [];
    public paginatedProfiles: Profile[] = []; 
    public currentPage = 1;
    public rowsPerPage = 8;
    public totalPages = 0;
    public pages: number[] = [];

    constructor(private profileService: ProfileService) {
        this.getProfiles();
        this.updatePagination();
    }

    public getProfiles(): void {
        this.profileService.consultProfiles().subscribe({
            next: (response) => {
                this.profiles = response;
                this.updatePagination();
            },
            error: (error) => {
                console.error("Error:", error);
            }
        });
    }

    public updatePagination() {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        const end = Math.min(start + this.rowsPerPage, this.profiles.length);
        this.paginatedProfiles = this.profiles.slice(start, end);
        this.totalPages = Math.ceil(this.profiles.length / this.rowsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    public changePage(page: number) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.updatePagination();
    }
}
