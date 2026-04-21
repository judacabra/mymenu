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

    public notification(msn: string): void {
        const success: string = `
              <div class="d-flex justify-content-around align-items-center">
                <i class="fas fa-check" style="font-size:50px;color:#3f80e5;"></i>
                <p style="margin:0;color:#3f80e5;">${msn}</p>
              </div>`;

        Swal.fire({
            position: "top-end",
            html: success,
            customClass: {
                popup: 'titleClass',
                htmlContainer: 'html-container',
            },
            showConfirmButton: false,
            timer: 3000,
        });
    }

    public async confirm(msn: string): Promise<boolean> {
        return Swal.fire({
            title: "Confirmación",
            icon: "question",
            text: msn,
            width: "350px",
        }).then((c) => c.isConfirmed);
    }
}
