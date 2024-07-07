import { Request, Response } from "express";
import BaseController from "../BaseController";
import EventModel from "../../models/event/EventModel";
import TransactionInstance from "../../models/transacction/TransactionModel";
import { OnSession } from "../../middleware/auth";
import { CancelationCreate, EventCreate, RefReference } from "../../type/event";

const TransactionModel = new TransactionInstance();

class UserController extends BaseController {

    public async DashboardController (req: Request, res: Response) {
        const transactionsCountPromise = TransactionModel.CountAllTransactions({});

        const transsactions = await transactionsCountPromise;

        return res.render(`s/event/dashboard.hbs`, {
            transactionCount: transsactions,
            ubication: `Resumen`,
        });
    }

    public async StaticticsController (req: Request, res: Response) {

        return res.render(`s/event/statictics.hbs`, {
            ubication: `Resumen`,
        });
    }

    // render list
    public async RenderList(req: Request, res: Response) {
        const pag = req.params.pag | 0;
        const limit = req.params.limit | 10; 

        const date = req.body.date;
        const status = req.body.status;

        console.log(`date`, date);
        const filter: any = {};

        if(status && status !== "ALL") filter.admin_status = status;
        if(date) filter.admin_date = date;

        console.log(`filter`, filter);

        const events = EventModel.GetEvents({pag, limit, filter});
        const countPromise = EventModel.CountBy({ filter });

        const Params = {
            list: await events,
            next: `/event/list?pag=${pag+1}`,
            previous: pag == 0 ? null : `/event/list?pag=${pag-1}`,
            count: await countPromise,

            nowTotal: ``,
            requirePagination: false,
            nowPath: pag,
            nowPathOne: pag!=0 ? true : false,
            nowPathEnd: false,
        }

        // console.log(Params.list);

        Params.nowTotal = `${Params.list.length+(pag*10)} / ${Params.count}`;
        Params.nowPathEnd = (Params.list.length-9)>0 ? true : false;
        
        Params.requirePagination = Params.count > 10 ? true : false;

        return res.render(`s/event/list.hbs`, Params);     
    }

    // render create
    public async RenderCreate(req: Request, res: Response) {
        const Params = {}

        return res.render(`s/event/create.hbs`, Params);  
    }

    // render show and update
    public async RenderShow(req: Request, res: Response) {
        const id = req.params.id;
        const event = await EventModel.FindEventById({id});

        if(null == event) {
            req.flash(`err`, `Evento no encontrado.`);
            return res.redirect(`/event/list`);
        }

        const Params = {data:event};
        return res.render(`s/event/show.hbs`, Params);  
    }

    // logic register
    public async CreateEventPost(req: Request, res: Response) {
        try {
            
            const {
                fullname, address, ci, email, phone,
    
                event_type, event_name, event_quantity_people, event_character, event_intro, event_cost,
    
                event_datetime_time_start, event_datetime_time_end,
    
                admin_code,
    
                coffee_bar, room, vip
            } = req.body;

            
            const evt: EventCreate = {
                fullname, address, ci, email, phone,
    
                event_quantity_people: Number(event_quantity_people),
                event_type, event_name, event_character, event_cost,
                event_intro: event_intro ? true : false,
                
                event_datetime_date: event_datetime_time_start.split(`T`)[0],
                event_datetime_tiem_start: event_datetime_time_start,
                event_datetime_tiem_end: event_datetime_time_end,
    
                admin_date:event_datetime_time_start.split(`T`)[0], 
                admin_code, 
                admin_datetime_start: event_datetime_time_start, 
                admin_datetime_end: event_datetime_time_end, 
                admin_status: `RECIBIDO`,
    
                
                coffe_bar: coffee_bar ? true : false,
                room: room ? true : false,
                vip: vip ? true : false
            }

            //
            await EventModel.CreateEvent({ data:evt })
            req.flash(`succ`, `Evento creado`);
            return res.redirect(`/event/list`);

        } catch (error) {
            console.log(error);
            req.flash(`err`, `No se pudo crear el evento.`);
            return res.redirect(`/event/list`);
        }
    }

    public async SetStateEvent(req: Request, res: Response) {
        const status = req.query.status;
        if(!status) {
            req.flash(`err`, `Error temporal, intentelo más tarde`);
            return res.redirect(`/event`);
        }

        const id = req.params.id;
        await EventModel.UpdateState({ id,status });
        req.flash(`succ`, `Evento actualizado a: ${status}`)
        return res.redirect(`/event/list`);
    }

    public async AddCancelation(req: Request, res: Response) {
        const { isCash, description, mount_total, mount_unity } = req.body;
        const id = req.params.id;
        const Save: CancelationCreate = {
            description, mount_unity,
            mount_total: Number(mount_total),
            eventId: id,
            isCash: isCash ? true : false
        };
        await EventModel.CreateCancelation({data:Save});
        req.flash(`succ`, `Cancelación creada.`);
        return res.redirect(`/event/list`);
    }

    public async SetPayment(req: Request, res: Response) {
        const {percentage,date,mount,code, /*mount_unity, mount_total,description*/} = req.body;
        const id = req.params.id;

        const data:RefReference = {
            percentage,date,mount,code,
            cancelationsId: id
        };

        await EventModel.AddCancelationTime({data});
        req.flash(`succ`, `Creado exitosamente.`);
        return res.redirect(`/event/list`);

    }

    public async UpdateAdmin(req: Request, res: Response) {
        const { admin_observation, admin_code } = req.body;
        const id = req.params.id;

        await EventModel.UpdateEvent({ data:{admin_observation, admin_code}, id });

        req.flash(`succ`, `Actualización exitosa`);
        return res.redirect(`/event/list`);
    }

    public LoadRouters() {
        this.router.get(`/event/`, OnSession, this.DashboardController);
        this.router.get(`/event/statictics`, OnSession, this.StaticticsController);
        this.router.get(`/event/list`, OnSession, this.RenderList);
        this.router.post(`/event/list`, OnSession, this.RenderList);
        this.router.get(`/event/create`, OnSession, this.RenderCreate);
        this.router.get(`/event/:id/update`, OnSession, this.RenderShow);

        this.router.post(`/event/:id/admin`, OnSession, this.UpdateAdmin);
        this.router.post(`/event/:id/status`, OnSession, this.SetStateEvent);
        this.router.post(`/event/create`, OnSession, this.CreateEventPost);
        this.router.post(`/event/:id/create/cancelation`, OnSession, this.AddCancelation);
        this.router.post(`/event/:id/set/payment`, OnSession, this.SetPayment);

        ///event/{{data.eventId}}/set/payment
        return this.router;
    }
}

export default new UserController();
