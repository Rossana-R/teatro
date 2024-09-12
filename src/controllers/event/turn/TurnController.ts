import { Request, Response } from "express";
import BaseController from "../../BaseController";
import TurnModel from "../../../models/event/TurnModel";
import TransactionInstance from "../../../models/transacction/TransactionModel";
import { OnSession } from "../../../middleware/auth";
import { CancelationCreate, EventCreate, RefReference } from "../../../type/event";
import { TurnCreate } from "../../../type/turn";

class UserController extends BaseController {

    constructor() {
        super();
    }
    
    public async Create(req: Request, res: Response) {
        const body = req.body as TurnCreate;

        body.time_end = body.time_end.split(`T`)[1] as string;
        body.time_start = body.time_start.split(`T`)[1] as string;

        await TurnModel.create(body);
        
        req.flash(`succ`, `Turno creado`);
        return res.redirect(`/turn`);
    }

    public async Find(req: Request, res: Response) {
        const pag = req.params.pag | 0;
        const limit = req.params.limit | 10;

        const turns = TurnModel.findAll({pag, limit});
        const countPromise = TurnModel.count();

        const Params = {
            list: await turns,
            next: `/turn/list?pag=${pag+1}`,
            previous: pag == 0 ? null : `/turn/list?pag=${pag-1}`,
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

        return res.render(`s/event/turn/list.hbs`, Params);     
    }

    public async RenderCreate(req: Request, res: Response) {
        return res.render(`s/event/turn/create.hbs`)
    }

    public LoadRouters() {
        this.router.post(`/turn`, OnSession, this.Create);
        this.router.get(`/turn`, OnSession, this.Find);
        this.router.get(`/turn/create`, OnSession, this.RenderCreate);
        ///event/{{data.eventId}}/set/payment
        return this.router;
    }

}

export default new UserController();
