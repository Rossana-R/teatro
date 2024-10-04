import { Request, Response } from "express";
import BaseController from "../BaseController";
import { OnSession } from "../../middleware/auth";
import { UserCompleted } from "../../type/user";
import { TransactionCreate } from "../../type/transaction";
import TransactionInstance from "../../models/transacction/TransactionModel";
import CategoryModel from "../../models/transacction/CategoryModel";
import TypeModel from "../../models/transacction/TypeModel";
import StaticticsTransaction from "../../models/statictics/StaticticsTransaction";
// import { Languaje, TypesFlash } from "../../var";

const TransactionModel = new TransactionInstance;

class TransactionController extends BaseController {

    constructor() {
        super();        
    }

    public async RenderList(req: Request, res: Response) {
        const pag = req.query.pag | 0;
        const limit = req.query.limit | 10;

        const transaction = TransactionModel.GetPagination({pag, limit});
        const countPromise = TransactionModel.CountAllTransactions({});

        const Params = {
            list: await transaction,
            next: `/transaction/?pag=${pag+1}`,
            previous: pag == 0 ? null : `/transaction/?pag=${pag-1}`,
            count: await countPromise,

            nowTotal: ``,
            requirePagination: false,
            nowPath: pag,
            nowPathOne: pag!=0 ? true : false,
            nowPathEnd: false,
        }

        Params.nowTotal = `${Params.list.length+(pag*10)} / ${Params.count}`;
        Params.nowPathEnd = (Params.list.length-9)>0 ? true : false;
        
        Params.requirePagination = Params.count > 10 ? true : false;
        return res.render(`s/transaction/list.hbs`, Params)
    }
    
    public async RenderCreate(req: Request, res: Response) {
        
        const types = TypeModel.GetPaginationType({ pag:0, limit:100 });
        const category = CategoryModel.GetPaginationCategory({ pag:0, limit:100 });

        const Params = {
            types: await types,
            category: await category
        };
        return res.render(`s/transaction/create.hbs`, Params)
    }

    public async RenderUpdate(req: Request, res: Response) {
        const id = req.params.id;
        const data = TransactionModel.GetById({id});
        const Params = {
            data: await data
        }
        return res.render(`s/transaction/update.hbs`, Params)
    }

    public async CreatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const {categoryId,date,mount,typeId,description} = req.body;

            const categoryPromise = CategoryModel.GetCategoryById({ id:categoryId }); 

            const data: TransactionCreate = {
                description,
                categoryId,
                date,
                mount: parseFloat(mount),
                typeId,
                createId:user.userId,
            };

            await TransactionModel.Create({data});

            const category = await categoryPromise;
            await StaticticsTransaction.conectOrCreate({ name:`${category?.name}`,num:data.mount });

            req.flash(`succ`, `Creado exitoso.`);
            return res.redirect(`/transaction`);

        } catch (error) {
            req.flash(`error`, `Error al crear.`)
            return res.redirect(`/transaction`);
        }
    }

    public async UpdatePost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const id = req.params.id;
            const {categoryId,date,mount,typeId,description} = req.body;

            const data: TransactionCreate = {
                description,
                categoryId,
                date,
                mount: parseInt(mount),
                typeId,
                createId:user.userId,
            };
            await TransactionModel.Update({ id, data });
            
            req.flash(`succ`, `Creado exitoso`)
            return res.redirect(`/transaction`);

        } catch (error) {
            req.flash(`error`, `Error al Crear`)
            return res.redirect(`/transaction`);
        }
    }

    public LoadRoutes() {
        this.router.get(`/transaction/`, OnSession, this.RenderList);
        this.router.get(`/transaction/create`, OnSession, this.RenderCreate);
        this.router.get(`/transaction/update/:id`, OnSession, this.RenderUpdate);

        this.router.post(`/transaction/create`, OnSession, this.CreatePost);
        this.router.post(`/transaction/update/:id`, OnSession, this.UpdatePost);

        return this.router;
    }
}

export default new TransactionController();
