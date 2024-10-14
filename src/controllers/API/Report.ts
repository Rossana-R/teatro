import { Request, Response } from "express";
import BaseController from "../BaseController";
import EventModel from "../../models/event/EventModel";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

class ReportController extends BaseController {
    
    public async ReportForEvent(req:Request, res:Response) {
        const id = req.params.id;
        console.log(id);

        const evt = await EventModel.FindEventById({ id });
        if(!evt) return res.status(400);

        const menbrete = `
        REPÚBLICA BOLIVARIANA DE VENEZUELA
        GOBIERNO BOLIVARIANO DEL ESTÁDO GUÁRICO
        FUNDACIÓN TEATRO SIMÓN BOLIVAR
        SAN JUAN DE LOS MORROS
        `;

        const doc = new PDFDocument({margin: 30, size: 'A4'});
        doc.font('Times-Roman');
        const cwd = process.cwd();
        doc.fontSize(9);
        const createPath = path.join(cwd, `/public/docs/${id}.pdf`);
        const downloadPath = `/docs/${id}.pdf`;
        const fullLine =  `__________________________________________________________________________________________`;

        (async function () {
            doc.image(path.join(cwd, `/public/izquierda.png`), 30, 35, {width:120});
            doc.text(menbrete, 150, 60, { align:"center",width:300 });
            doc.image(path.join(cwd, `/public/derecha.png`), 450, 30, {width:120});

            doc.fontSize(12);
            doc.text(fullLine, 0, 109, { align:"center", width:doc.page.width });
            doc.text(`FICHA TÉCNICA`, 0, 120, { align:"center", width:doc.page.width });
            doc.text(fullLine, 0, 121, { align:"center", width:doc.page.width });
            doc.fontSize(9);

            doc.text(`PARA EL CONTRATANTE`, 30, 135);
            doc.text(`NOMBRE Y APELLIDO:    __${evt.fullname}__`, 30, 145);
            doc.text(`CÉDULA DE IDENTIDAD:  __${evt.ci}__`, 30, 155);
            doc.text(`DIRECCIÓN: __${evt.address}__`, 30, 165);
            doc.text(`TELÉFONO: __${evt.phone}__        CORREO: __${evt.email}__`, 30, 175);
            doc.text(`TIPO DE EVENTO: __${evt.event_type}__`, 30, 185);
            doc.text(`NOMBRE DEL EVENTO: __${evt.event_name}__`, 30, 195);
            doc.text(`CONVOCATORIA PARA EL EVENTO:       VENTA DE ENTRADA: __${evt.event_intro ? `SI` : `NO`}__     COSTO: __${evt.event_intro ? evt.event_cost : ``}__`, 30, 205);
            doc.text(`                                   GRATUITO: __${evt.event_intro ? `NO` : `SI`}__     COSTO: __${evt.event_intro ? evt.event_cost : ``}__`, 30, 215);
            doc.text(`                                   GRATUITO: __${evt.event_intro ? `NO` : `SI`}__`, 30, 225);
            doc.text(`ÁREA SOLICITADA:      SALA: _${evt.room ? `x` : `_`}_     CAFE/BAR: _${evt.coffe_bar ? `x` : `_`}_    VIP: _${evt.vip ? `x` : `_`}_`, 30, 245);
            doc.text(`CANTIDAD DE PERSONAS: __${evt.event_quantity_people}__`, 30, 265);
            doc.text(`RESPONSABLE DEL EVENTO: __${evt.fullname}__`, 30, 275);
            doc.text(`CÉDULA DE IDENTIDAD: __${evt.ci}__`, 30, 285);
            doc.text(`CARÁCTER DEL EVENTO:     APOYO: __${evt.event_character === `APOYO` ? evt.event_character : `_`}__        PRIVADO: __${evt.event_character === `PRIVADO` ? evt.event_character : `_`}__        APORTE: __${evt.event_character === `APORTE` ? evt.event_character : `_`}__`, 30, 295);
            
            doc.font(`Courier-Bold`)
            doc.text(`MONTAJE DEL EVENTO`, 30, 315, {  });
            doc.font(`Times-Roman`)

            doc.text(`FECHA:  __${evt.admin_date}__             HORA DE INICIÓN:  __${evt.admin_datetime_start.split(`T`)[1]}__`, 30, 325);
            doc.text(`                                          HORA DE CULMINACIÓN:  __${evt.admin_datetime_end.split(`T`)[1]}__`, 30, 335);
            
            doc.text(`${fullLine}_______________________________`, 0, 355, { align:"center", width:doc.page.width });
            doc.font(`Courier-Bold`)
            doc.text(`PARA LA ADMINISTRACIÓN DEL TEATRO`, 30, 365, {  });
            doc.font(`Times-Roman`)
            doc.text(`FECHA DEL EVENTO:     __${evt.admin_date}__          CÓDIGO DE RESERVA: __${evt.admin_code ? evt.admin_code : `sin código`}__`, 30, 375);
            doc.text(`HORA DE INICIO:     __${evt.admin_datetime_start.split(`T`)[1]}__            HORA DE CULMINACIÓN: __${evt.admin_datetime_end.split(`T`)[1]}__`, 30, 385);
            doc.text(`ARANCEL: ________             APORTE: ________                    EXONERADO: ________`, 30, 410);

            let nowTop = 440;
            evt.cancelationRef?.cancelationRef.forEach((item) => {
                doc.text(`${item.percentage}%   FECHA:  __${item.date}__    RECIBO N: __${item.code}__`, 0, nowTop, { align:"center", width:doc.page.width });
                nowTop += 15;
            });

            doc.text(`${fullLine}_______________________________`, 0, nowTop+40, { align:"center", width:doc.page.width });
            doc.font(`Courier-Bold`)
            doc.text(`OBSERVACIONES`, 30, nowTop+30, {  });
            doc.font(`Times-Roman`)
            doc.text(`${evt.admin_observation}`, 0, nowTop+50, { align:"center" });
            doc.text(`${fullLine}_______________________________`, 0, nowTop+65, { align:"center", width:doc.page.width });
            doc.text(`${fullLine}_______________________________`, 0, nowTop+80, { align:"center", width:doc.page.width });
            doc.text(`${fullLine}_______________________________`, 0, nowTop+95, { align:"center", width:doc.page.width });
            doc.text(`${fullLine}_______________________________`, 0, nowTop+110, { align:"center", width:doc.page.width });
            doc.text(`${fullLine}_______________________________`, 0, nowTop+125, { align:"center", width:doc.page.width });


            doc.text(`${fullLine}_______________________________`, 0, nowTop+140, { align:"center", width:doc.page.width });
            doc.font(`Courier-Bold`);
            doc.text(`PARA EL CONTRATANTE`, 30, nowTop+150, {  });
            doc.font(`Times-Roman`);
            doc.text(`EL SOLICITANTE SE COMPROMETERÁ EN APORTAR LOS DATOS FIDEDIGNOS EN LA PRESENTE FECHA, PARA DEJAR CONSTANCIA DE LA RESERVA PREVIAMENTE REALIZADA, A FIN DE CONCRETAR EL EVENTO PAUTADO`, 30, nowTop+160, { align:"center" });

        
            nowTop += 70;
            doc.font(`Courier-Bold`);
            doc.text(`SE COMPROMETE A:`, 30, nowTop+150, {  });
            doc.font(`Times-Roman`);

            doc.text(`1. NO SOBREPASAR LA CANTIDAD DE PERSONAS INDICADAS EN LA FICHA.`, 60, nowTop+170, { width:doc.page.width-90 });
            doc.text(`2. NO AMARRAR, CLAVAR, PEGAR, GRAPAR, COLOCAR O FIJAR NINGÚN TIPO DE OBJETO, CARTEL O TELA EN LA SUPERFICIE DEL TABLONCILLO, PAREDES O PISO DEL TEATRO.`, 60, nowTop+180, { width:doc.page.width-90 });
            nowTop += 10;
            doc.text(`3. NO RODAR NINGÚN TIPO DE OBJETO EN LA SUPERFICIE DEL TABLONCILLO`, 60, nowTop+190, { width:doc.page.width-90 });
            doc.text(`4. AL CULMINAR EL EVENTO TODO MOBILIARIO DEBE SER RETIRADO DE LAS INSTALACIONES DEL TEATRO`, 60, nowTop+200, { width:doc.page.width-90 });
            doc.text(`5. DE EXISTIR ALGÚN DAÑO DE PARTE DE LOS USUARIOS DURANTE EL EVENTO, LA PERSONA RESPONSABLE DEBE CUBRIR CON LOS GASTOS CORRESPONDIENTES`, 60, nowTop+210, { width:doc.page.width-90 });
            nowTop += 10;
            doc.text(`6. NO SE PERMITE EL INGRESO DE NINGÚN TIPO DE ALIMENTOSY BEBIDAS AL ÁREA DE LA SALA Y VIP`, 60, nowTop+220, { width:doc.page.width-90 });
            doc.text(`7. RESPETAR LOS HORARIOS ASIGNADOS PARA SONIDO, DECORACIÓN Y MONTAJE`, 60, nowTop+230, { width:doc.page.width-90 });
            doc.text(`7. EL DÍA DEL EVENTO NO SE PERMITE EL USO DE ÁREAS QUE NO HAN SIDO SEÑALADAS EN ESTA FICHA. SIN EXCEPSIÓN`, 60, nowTop+240, { width:doc.page.width-90 });

            doc.text(`${fullLine}_______________________________`, 0, nowTop+120, { align:"center", width:doc.page.width });
            doc.font(`Courier-Bold`);
            doc.text(`IMPORTANTE`, 50, nowTop+270, {  });

            nowTop += 270;
            doc.text(
                `LA ADMINISTRACIÓN DEL TEATRO NO SE HACE RESPONSABLE POR LA PERDIDA O EXTRAVIO DE OBJETOS Y PERTENECIAS DURANTE EL EVENTO, ASÍ MISMO, NO REALIZA REEMBOLSO DE DINERO CUANDO EL CONTRATANTE REALIZA CAMBIOS DE RECHA Y/0 NO REALIZA EL EVENTO EN LA FECHA PAUTADA; TAMPOCO SI EL CONTRATANTE EXCEDE EL LIMITE DE 90 DÍAS LUEGO DE LA FECHA ACORDAD EN ESTA FICHA. CABE SEÑALAR QUE PASADO LOS NOVENTA DÍAS EL CONTRATANTE PUEDE RENEGOCIAR LOS TERMINOS PARA AJUSTAR EL MONTO DE ARANCEL ES NECESARIO DETACAR QUE SI EL CONTRATANTE INFRINGE EN ALGUNO DE LOS TÉRMINOS SEÑALADOS EN LA FICHA, LA ADMINISTRACIÓN DEL TEATRO DISUELVE TODO COMPROMISO CON EL CONTRATANDE DE FORMA INMEDIATA.`,
                30, 
                nowTop+60, 
                { align:"center",width:doc.page.width-60 }
            );

            doc.text(
                `SE LEE Y FIRMA EN LA CIUDAD DE SAN JUAN DE LOS MORROS A LOS ______ DÍAS DEL MES DE ________ DEL AÑO _______`, 
                30, 
                180, 
                { width:doc.page.width-90 }
            );

            doc.text(`POR EL TEATRO`, 30, 180+30, {  });
            doc.text(`CONTRATANTE O RESPONSABLE`, 330, 180+30, {  });

            doc.text(`_______________________________________`, 30, 180+100, {  });
            doc.text(`_______________________________________`, 330, 180+100, {  });
            doc.font(`Times-Roman`);



            doc.end();  
        })();
        
        doc.pipe(fs.createWriteStream(createPath));

        return res.status(200).json({ file:downloadPath });
    }

    public LoadRoutes() {
        
        this.router.get(`/api/report/event/:id`, this.ReportForEvent);

        return this.router;
    }
}

export default new ReportController();
