import { Injectable } from '@angular/core';

import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})

export class AlertService {

    constructor() { }

    public alert(msn: string, icon: SweetAlertIcon, showConfirmButton: boolean = true, timer: number = 2000): void {
        Swal.fire({
            title: "Notificación",
            icon: icon,
            text: msn,
            width: "350px",
            showConfirmButton,
            timer,
        })
    }

    public notification(msn: string, success: boolean = true): void {
        const html: string = `
              <div class="d-flex justify-content-around align-items-center">
                <i class="fas ${success ? 'fa-check' : 'fa-times'}" style="font-size:50px; color: ${success ? '#3f80e5' : '#dc3545'};"></i>
                <p style="margin: 0; color: ${success ? '#3f80e5' : '#dc3545'};">${msn}</p>
              </div>`;

        Swal.fire({
            position: "top-end",
            html,
            customClass: {
                popup: 'titleClass',
                htmlContainer: 'html-container',
            },
            showConfirmButton: false,
            timer: 3000,
        });
    }

    public async confirm(msn: string, confirmButtonText: string = 'Ok'): Promise<boolean> {
        return Swal.fire({
            title: "Confirmación",
            icon: "question",
            text: msn,
            width: "350px",
            confirmButtonText,
            confirmButtonColor: "#dc3545",
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
        }).then((c) => c.isConfirmed);
    }
}
