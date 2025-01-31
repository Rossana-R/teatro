import { Request, Response } from "express";
import BaseController from "../BaseController";
import EventModel from "../../models/event/EventModel";
import TypeModel from "../../models/transacction/TypeModel";
import CategoryModel from "../../models/transacction/CategoryModel";
import TransactionInstance from "../../models/transacction/TransactionModel";
import { OnSession } from "../../middleware/auth";
import { Prisma } from "@prisma/client";
import { pushPdf } from "../../models/pdf/GeneratePDFkit";

const TransactionModel = new TransactionInstance();

class ReportController extends BaseController {

    public async HandleEventReport(req: Request, res: Response) {
        const skip = req.query.skip ? Number(req.query.skip) : 0; 
        const take = req.query.take ? Number(req.query.take) : 50; 

        const status = req.query.status;
        const month = req.query.month;

        const fitlerRender: string[] = [];
        const filter: Prisma.EventWhereInput[] = [];
        
        if(status) { 
            filter.push({ admin_status:status });
            fitlerRender.push(`Estado: ${status}`);
        } else {
            fitlerRender.push(`Estado: TODOS`);
        }
        if(month) { 
            filter.push({ admin_date:{ contains:`-${month}-` } });
            fitlerRender.push(`Mes: ${month}`);
        } else {
            fitlerRender.push(`Mes: TODOS`);
        }

        const count = await EventModel.CountBy({ filter:{AND:filter} });
        let pagTake = 20;
        const headers = [``,`fecha`, `Responsable`, `Estado`, `Caracter`];
        const rows: string[][] = [];

        let i = 0;
        do {
            const result = await EventModel.ReportEvent({
                filter: {
                    AND: filter
                },
                skip:pagTake-20,
                take:pagTake
            });

            result.result.forEach((item,i)=>{
                rows.push([i.toString(),`${item.admin_date}`,`${item.fullname}`,`${item.admin_status}`,`${item.event_character}`]);
            });            

            i++;
        } while (count>pagTake);    

        const pdf = await pushPdf({
            headers,
            rows,
            title:`Reporte`,
            filter: fitlerRender,
            count
        });

        return res.render(`s/report/event.hbs`, {
            // result:result.result,
            count:count,
            file: pdf,
            filter: fitlerRender,
        });
    }

    public async HandleTransactionReport(req: Request, res: Response) {

        const TypePromise = TypeModel.GetPaginationType({ pag:0,limit:50 });
        const CategoryPromise = CategoryModel.GetPaginationCategory({ pag:0,limit:50 });
        const yearsPromise = TypeModel.GetYears({});

        // const status = req.query.status;
        const date = req.query.date;
        const month = req.query.month;
        const type = req.query.type;
        const category = req.query.category;
        const currentYear = req.query.currentYear;

        const fitlerRender: string[] = [];
        const filter: Prisma.TransactionWhereInput[] = [];

        let categoryResult;

        if(category && type) {
            const typeResult = await TypeModel.GetTypeById({ id:type })
            categoryResult = await CategoryModel.GetCategoryById({ id:category });

            filter.push({ AND:[{categoryId:category},{typeId:type}] });
            fitlerRender.push(`Tipo: ${typeResult?.name}`);
            fitlerRender.push(`Categoria: ${categoryResult?.name}`);


        }
        else {
            if(type) { 
                const result = await TypeModel.GetTypeById({ id:type })
                filter.push({ typeId:type });
                fitlerRender.push(`Tipo: ${result?.name}`);
            } else {
                fitlerRender.push(`Tipo: TODOS`);
            }

            if(category) { 
                const result = await CategoryModel.GetCategoryById({ id:category });
                filter.push({ categoryId:category });
                fitlerRender.push(`Categoria: ${result?.name}`);
            } else {
                fitlerRender.push(`Categoria: TODOS`);
            }
        }

        if(currentYear) filter.push({ date:{contains:`${currentYear}`} });
        if(month) filter.push({ date:{contains:`-${month.length > 1 ? month : `0${month}`}-`} });

        const count = await TransactionModel.CountAllBy({ filter:filter.length > 1 ? {AND:filter} : filter[0] });
        let pagTake = 20;
        const headers = [``,`Descripción`, `Monto`, `Fecha`];
        const rows: string[][] = [];

        let i = 0;
        let total = 0;
        let totalIngr = 0;
        let totalEgre = 0;

        const test = await TransactionModel.GetAllSald({ filter:filter.length > 1 ? {AND:filter} : filter[0] });

        const typeResults = await TypePromise;
        const categoryResults = await CategoryPromise;
        const year = await yearsPromise;

        const currentFields: string[] = [];

        test.forEach(item => {
            const category = categoryResults.find(key => key.transactionCategoryId === item.categoryId);
            currentFields.push(`${category?.name} ${item._sum.mount}`)
        })

        do {
            const result = await TransactionModel.ReportTransaction({
                filter: filter.length > 1 ? {AND:filter} : filter[0],
                skip:pagTake-20,
                take:pagTake
            });

            result.result.forEach((item,i)=>{
                total += item.mount;

                rows.push([i.toString(),`${item.description}`,`${item.mount}`,`${item.date}`]);
            });           
            
            i++;
        } while (count>pagTake);    

        const pdf = await pushPdf({
            headers,
            rows,
            title:`Reporte`,
            filter: fitlerRender,
            count,
            current: currentFields
        });

        return res.render(`s/report/transaction.hbs`, {
            file: pdf,
            filter: fitlerRender,
            count,
            type: typeResults,
            category: categoryResults,
            years: year
        });
    }

    public LoadRouters() {        
        this.router.get(`/report/transaction`, OnSession, this.HandleTransactionReport);
        this.router.get(`/report/event`, OnSession, this.HandleEventReport);

        return this.router;
    }
}

export default new ReportController();
