import { Request, Response } from "express";
import EventModel from "../models/event/EventModel";
import BaseController from "./BaseController";
import { pushPdf } from "../models/pdf/GeneratePDFkit";

class PublicController extends BaseController {

    constructor() {
        super();
    }

    public async MyEvent(req: Request, res: Response) {
        const id = req.params.id;

        const event = await EventModel.FindEventById({ id });

        if(!event || event?.admin_status === `RECIBIDO`) return res.render(`p/404.hbs`); 

        const Params = {
            data: event,
            isEvent: true
        }

        if (!event) {
            Params.isEvent = false;
        } 

        return res.render(`p/myevent.hbs`, Params);        
    }

    public async PublicScreen(req: Request, res: Response) {
        // pushPdf();

        // public
        return res.render(`p/public.hbs`);
    }

    public async ReservedScreen(req: Request, res: Response) {     
        let create = req.query.create ? true : false;
        const date = req.query.date;
        let event = await EventModel.FindEventToDate({ date });

        if (date === undefined) {
            event = null;
        }

        // public
        return res.render(`p/reserved.hbs`, {create,event,date});
    }

    public async SearchScreen(req: Request, res: Response) {
        
        // public
        return res.render(`p/search.hbs`);
    }


    public async RecervedDay(req: Request, res: Response) {
        return res.render(`p/reserved.hbs`)
    }

    public LoadRoutes() {
        this.router.get(`/public/event/:id`, this.MyEvent);
        this.router.get(`/`, this.PublicScreen);
        this.router.get(`/reserved`, this.ReservedScreen);
        this.router.get(`/search`, this.SearchScreen);
        return this.router;
    }
}

export default new PublicController();
