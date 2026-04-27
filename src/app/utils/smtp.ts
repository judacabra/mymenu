export default class SMTP {
    constructor(){}
    
    buildBodyClientMail(motives: any[], data: any): string {
        const colorCompany: string = "#523D27";

        let body: string = 
        `<!DOCTYPE html>
        <html lang="es-CO">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email</title>

            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">

            <style>
                .container { width: 70vw !important; padding-left: 3rem !important; padding-right: 3rem !important; }
                .bg-gray { background: #eee; }
                .rounded-50 { border-radius: 50px; }
                .w-40 { width: 40%; }
                .w-60 { width: 60%; }
                .w-15-vw { width: 15vw; }
                .bg-company { background: ${colorCompany}; }
                .br-company { border: solid ${colorCompany}; border-top: none; }
                .br-end-company { border: solid ${colorCompany}; border-bottom: none; border-top: none; border-left: none; }
                .rounded-top-40 { border-radius: 40px 40px 0 0; }
                .rounded-bottom-40 { border-radius: 0 0 40px 40px; }
            </style>
        </head>

        <body>
            <div class="container d-flex justify-content-center align-item-center bg-company rounded-top-40 mt-3 py-4">
                <img id="company_img" alt="image-company" class="w-50" src="http://192.168.1.119:8000/uploads/company/elcorreo.png" />
            </div>
            <div class="container py-5 br-company rounded-bottom-40 mb-3">                
                <h1> Tu reserva </h1>
                <h3 class="mb-5"> Tu reserva se ha completado satisfactoriamente.</h3>

                <div class="d-flex bg-gray rounded-50 p-3 mt-3 mb-4 br-company border-bottom-0">
                    <div id="icon" class="d-flex justify-content-center align-items-center w-40 br-end-company">
                        <img id="check_img" alt="check-green" class="w-15-vw" src="http://192.168.1.119:8000/uploads/smtp/check-green.png" />
                    </div>

                    <div id="info" class="d-flex flex-column w-60 px-5">
                        <h4> Gracias por reservar </h4> 
                        <br>

                        <p class="m-0 p-0">🗓️ <b>Fecha:</b> ${new Date(data.value.date).toLocaleString().split(",")[0]}</p>
                        <p>⏱️ <b>Hora:</b> ${data.value.time}</p>

                        <p class="m-0 p-0">👤 <b>Nombre:</b> ${data.value.fullname}</p>
                        <p class="m-0 p-0">🆔 <b>Documento:</b> ${data.value.document}</p>
                        <p class="m-0 p-0">👥 <b>Cantidad de personas:</b> ${data.value.cantidad_personas}</p>
                        <p class="m-0 p-0">🎊 <b>Incluye decoración:</b> ${data.value.incluye_deco === "Si" ? "Sí ✅" : "No ❎"}</p>`;

                    if (data.value.incluye_deco === "Si") {
                        body += `<p class="m-0 p-0"> 🎯 <b>Motivo:</b> `;

                        if (data.value.motive != "6") {
                            body += motives.find((m: any) => m.id == Number(data.value.motive))?.name 
                        } else {
                            body += data.value.other_motive
                        }

                        body += "</p>"
                    }

                    if (data.value.info_adicional.trim() !== "") {
                        body += `<p class="m-0 p-0"> ✨ <b>Información adicional:</b> ${data.value.info_adicional}</p>`;
                    }

        body +=     `<br />
                    </div>
                </div>

                <div id="buttons" class="d-flex justify-content-center align-items-center">
                    <button 
                        type="button" 
                        id="newBooking" 
                        class="btn btn-primary px-3" 
                        onclick="window.open('http://localhost:4200/mymenu/bookings', '_blank')"
                    > Nueva reserva </button>
                </div>
            </div>
        </body>
        </html>`;

        return body;
    }

    buildBodyCompanyMail(motives: any[], data: any): string {
        const colorCompany: string = "#0d0d0d";

        let body: string = 
        `<!DOCTYPE html>
        <html lang="es-CO">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email</title>

            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">

            <style>
                .container { width: 70vw !important; padding-left: 3rem !important; padding-right: 3rem !important; }
                .bg-gray { background: #eee; }
                .rounded-50 { border-radius: 50px; }
                .w-40 { width: 40%; }
                .w-60 { width: 60%; }
                .w-15-vw { width: 15vw; }
                .bg-company { background: ${colorCompany}; }
                .br-company { border: solid ${colorCompany}; border-top: none; }
                .br-end-company { border: solid ${colorCompany}; border-bottom: none; border-top: none; border-left: none; }
                .rounded-top-40 { border-radius: 40px 40px 0 0; }
                .rounded-bottom-40 { border-radius: 0 0 40px 40px; }
            </style>
        </head>

        <body>
            <div class="container d-flex justify-content-center align-item-center bg-company rounded-top-40 mt-3 py-4">
                <img id="company_img" alt="image-company" class="w-50" src="http://192.168.1.119:8000/uploads/company/logo.png" />
            </div>
            <div class="container py-5 br-company rounded-bottom-40 mb-3">                
                <h1> Nueva reserva </h1>
                <h3 class="mb-5"> A continuación la información para la reserva que solicita ${data.value.fullname}.</h3>

                <div class="d-flex bg-gray rounded-50 p-3 mt-3 mb-4 br-company border-bottom-0">
                    <div id="info" class="d-flex flex-column px-5">
                        <h4> Por favor, confirma la reserva lo antes posible </h4> 
                        <br>

                        <p class="m-0 p-0">🗓️ <b>Fecha:</b> ${new Date(data.value.date).toLocaleString().split(",")[0]}</p>
                        <p>⏱️ <b>Hora:</b> ${data.value.time}</p>

                        <p class="m-0 p-0">👤 <b>Nombre:</b> ${data.value.fullname}</p>
                        <p class="m-0 p-0">🆔 <b>Documento:</b> ${data.value.document}</p>
                        <p class="m-0 p-0">👥 <b>Cantidad de personas:</b> ${data.value.cantidad_personas}</p>
                        <p class="m-0 p-0">🎊 <b>Incluye decoración:</b> ${data.value.incluye_deco === "Si" ? "Sí ✅" : "No ❎"}</p>`;

                    if (data.value.incluye_deco === "Si") {
                        body += `<p class="m-0 p-0"> 🎯 <b>Motivo:</b> `;

                        if (data.value.motive != "6") {
                            body += motives.find((m: any) => m.id == Number(data.value.motive))?.name 
                        } else {
                            body += data.value.other_motive
                        }

                        body += "</p>";
                    }

                    if (data.value.info_adicional.trim() !== "") {
                        body += `<p class="m-0 p-0"> ✨ <b>Información adicional:</b> ${data.value.info_adicional}</p>`;
                    }

        body +=     `<br />
                    </div>
                </div>

                <div id="buttons" class="d-flex justify-content-center align-items-center">
                    <button 
                        type="button" 
                        class="btn btn-primary px-3" 
                        id="confirmBooking"
                        onclick="async function confirmNewBooking() {
                            await fetch('http://192.168.1.119:8000/send-mail', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: {
                                    'to': ${data.value.email},
                                    'subject': "Reserva confirmada",
                                    'body': ${this.buildBodyClientMail(motives, data).toString()},
                                }
                            });
                        }"
                    > Confirmar reserva </button>
                </div>
            </div>
        </body>

        </html>`;

        return body;
    }
}