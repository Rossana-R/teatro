// import PDFDocument from "pdfkit";
import PDFDocument from "pdfkit-table";
import path from "path";
import fs from "fs";

export const pushPdf = async ({title,headers, rows,filter,count}:{title:string,headers:string[],rows:string[][],filter:string[],count:number}) => {
    const date = new Date();
    const ext = `pdf`;
    const datetime = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const name = `reporte.${ext}`;
    const doc = new PDFDocument({margin: 30, size: 'A4'});
    doc.font('Times-Roman');
    const downlaodPath = `/docs/report/${name}`;
    const createPath = path.join(process.cwd(), `/public/docs/report`, name);
    // doc.text('Reporte', 0, 0);

    console.log(createPath);

    // return   {path:createPath,download:downlaodPath};
    doc.text(`Teatro Simón Bolivar - Reporte ${datetime}`);

    (async function () {
        doc.text(`Resultados: ${count}`, { height:10 });
        filter.forEach((item) => {
            doc.text(item);
        })
        const table = {
            title,
            headers,
            rows
        };

        doc.table(table, { title:`Reporte` });

    })();

    console.log(path.join(`public/docs/report`, name));
    doc.pipe(fs.createWriteStream(path.join(`public/docs/report/reporte.pdf`)));
    doc.end();

    return {path:createPath,download:downlaodPath};
}
