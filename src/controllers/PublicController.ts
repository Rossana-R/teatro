import { Request, Response } from "express";
import EventModel from "../models/event/EventModel";
import BaseController from "./BaseController";

class PublicController extends BaseController {

    constructor() {
        super();
    }

    public async MyEvent(req: Request, res: Response) {
        const id = req.params.id;

        const event = await EventModel.FindEventById({ id });

        console.log(event);

        const Params = {
            data: event,
            isEvent: true
        }

        if (!event) {
            Params.isEvent = false;
        } 

        console.log(Params);

        return res.render(`p/myevent.hbs`, Params);        
    }


    public LoadRoutes() {
        this.router.get(`/public/event/:id`, this.MyEvent);
        return this.router;
    }
}

export default new PublicController();
