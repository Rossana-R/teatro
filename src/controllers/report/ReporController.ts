import { Request, Response } from "express";
import BaseController from "../BaseController";
import EventModel from "../../models/event/EventModel";
import TypeModel from "../../models/transacction/TypeModel";
import CategoryModel from "../../models/transacction/CategoryModel";
import TransactionInstance from "../../models/transacction/TransactionModel";
import { OnSession } from "../../middleware/auth";
import { Prisma } from "@prisma/client";

const TransactionModel = new TransactionInstance();

class ReportController extends BaseController {


    public async HandleEventReport(req: Request, res: Response) {
        const skip = req.query.skip ? Number(req.query.skip) : 0; 
        const take = req.query.take ? Number(req.query.take) : 50; 

        const month = req.query.month ? `${req.query.month}` : ``;
        const status = req.query.status ? `${req.query.status}` : ``;

        const renderFilter: {key:string,value:string}[] = [];

        const filter: Prisma.EventWhereInput[] = [];
        
        if (month !== ``) {
            renderFilter.push({ key:`Mes`, value:`${month}` });
            filter.push({ admin_date: { contains:`-${month}-` } }); 
        }
        
        if (status !== ``)  {
            renderFilter.push({ key:`Estado`, value:`${status}` });
            filter.push({ admin_status: { contains:status } });
        }

        const result = await EventModel.ReportEvent({
            filter: {
                AND: filter
            },
            skip,
            take
        });

        return res.render(`s/report/event.hbs`, {
            result:result.result,
            count:result.count,
            filter:renderFilter
        });
    }

    public async HandleTransactionReport(req: Request, res: Response) {

        const TypePromise = TypeModel.GetPaginationType({ pag:0,limit:50 });
        const CategoryPromise = CategoryModel.GetPaginationCategory({ pag:0,limit:50 });

        const skip = req.query.skip ? Number(req.query.skip) : 0; 
        const take = req.query.take ? Number(req.query.take) : 50; 

        const date = req.query.date ? `${req.query.date}` : ``;
        const month = req.query.month ? `${req.query.month}` : ``;
        const type = req.query.type ? `${req.query.type}` : ``;
        const category = req.query.category ? `${req.query.category}` : ``;

        const renderFilter: {key:string,value:string}[] = [];
        const filter: Prisma.TransactionWhereInput[] = [];
        
        if(type !== ``) {
            const typePromise = await TypeModel.GetTypeById({ id:type });
            if (typePromise) {
                renderFilter.push({ key:`Tipo`, value:`${typePromise.name}` });
                filter.push({ typeId:typePromise.transactionTypeId });
            }
        }

        if(category !== ``) {
            const categoryPromise = await CategoryModel.GetCategoryById({ id:category });
            if (categoryPromise) {
                renderFilter.push({ key:`Categoria`, value:`${categoryPromise.name}` });
                filter.push({ categoryId:categoryPromise.transactionCategoryId });
            }
        }

        if (month !== ``) {
            renderFilter.push({ key:`Mes`, value:`${month}` });
            filter.push({ date: { contains:`-${month}-` } });
        }

        if (date !== ``) {
            renderFilter.push({ key:`Fecha`, value:`${date}` });
            filter.push({ date: { equals:date } });
        }

        console.log(req.query);
        console.log(renderFilter);
        console.log(`category`);
        console.log(category);

        const result = await TransactionModel.ReportTransaction({
            filter: {
                AND: filter
            },
            skip,
            take,
        });

        return res.render(`s/report/transaction.hbs`, {
            result:result.result,
            count:result.count,
            filter:renderFilter,
            type: await TypePromise,
            category: await CategoryPromise,
        });
    }

    public LoadRouters() {        
        this.router.get(`/report/transaction`, OnSession, this.HandleTransactionReport);
        this.router.get(`/report/event`, OnSession, this.HandleEventReport);

        return this.router;
    }
}

export default new ReportController();
