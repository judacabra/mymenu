import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import lottie from 'lottie-web';

import { CompanyService } from '@services/company/company.service';
import { AlertService } from '@services/alertService/alert.service';

import { Company } from '@core/interfaces/company';

export interface Section {
    name: string,
    url: string
}

@Component({
    selector: 'app-webpage',
    standalone: true,
    imports: [],
    templateUrl: './webpage.component.html',
    styleUrl: './webpage.component.css',
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
    ]
})

export default class WebpageComponent implements OnInit {
    public apiWpp: string = 'https://api.whatsapp.com/send?phone=573057506743&text=Hola%20quiero%20empezar%20a%20utilizar%20*MyMenu*%20ahora%20mismo.';
    public path: string = './public/';
    public path_img: string = this.path + 'img/';
    public path_json: string = this.path + 'json/';
    public logo_company: string = 'mm-logo.png';
    public bg_1: string = 'bg-home.png';
    public btnVisible: boolean = false;
    public companies: Company[] = [];

    public sections: Section[] = [
        {
            name: '¿PORQUE MyMenu?',
            url: 'index#why-us',
        },
        {
            name: 'CLIENTES',
            url: 'index#clients',
        },
        {
            name: 'CONTACTO',
            url: 'index#contact',
        },
    ];

    constructor(
        private companyService: CompanyService, 
        private element: ElementRef, 
        private alertService: AlertService
    ) {
        this.getCompanies();
    }

    ngOnInit(): void {
        register();

        lottie.loadAnimation({
            container: this.element.nativeElement.querySelector('.lottie-check'),
            path: this.path_json + 'check.json',
            renderer: 'svg',
            loop: true,
            autoplay: true,
        });

        lottie.loadAnimation({
            container: this.element.nativeElement.querySelector('.lottie-contact'),
            path: this.path_json + 'contact.json',
            renderer: 'svg',
            loop: true,
            autoplay: true,
        });
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.btnVisible = (window.top?.scrollY === 0) ? false : true;
    }

    public scrollToTop(): void {
        if (window.top?.scrollY === 0) {
            this.btnVisible = false;
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
    

    public goToLogin(): void {
        window.location.href = '/admin';
    }

    public goToWpp(): void {
        window.open(this.apiWpp, '_blank');
    }


    public getCompanies(): void {
        this.companyService.consultCompanies().subscribe({
            next: (response: any) => {
                this.companies = response;
            },
            error: (error: any) => {
                console.error("Error: ", error);
            }
        });
    }

    public sendMessage(event: Event): void{
        event!.preventDefault();
        const msg = 'Mensaje Enviado Exitosamente';

        this.alertService.notification(msg);
    }
}
