import { Request, Response } from "express";
import { CountsAll, GetEventById } from "../model/EventModel";
import { GetEvents } from "../model/event.model";

// renders

export async function RenderEventDashboard(req: Request, res: Response) {

    const ToView = {
            ubication: `Panel de eventos`,
            eventCount: await CountsAll(),
    }

    return res.render(`event/dashboard.hbs`, ToView);
}

export async function RenderEventList(req: Request, res: Response) {

    const pag = Number(req.query.pag) ? Number(req.query.pag) : 1;
    const ToView = {
        ubication: `Lista de eventos`,
        eventCount: await CountsAll(),
        events: await GetEvents({pag}),
        previousPath: `/events/list/?pag=${pag-1}`,
        nextPath: `/events/list/?pag=${pag+1}`,
        nowTotal: ``,
        requirePagination: false,
        nowPath: pag,
        nowPathOne: pag!=0 ? true : false,
        nowPathEnd: false,
    }

    ToView.nowTotal = `${ToView.events.length+(pag*10)} / ${ToView.eventCount}`;
    ToView.nowPathEnd = (ToView.events.length-9)>0 ? true : false;
    console.log(ToView.events.length, ToView.nowPathEnd)
    
    ToView.requirePagination = ToView.eventCount > 10 ? true : false;

    return res.render(`event/list.hbs`, ToView);
}

export async function RenderEventNew(req: Request, res: Response) {

    const ToView = {
        ubication: `Crear evento`,
    }
    return res.render(`event/create.hbs`, ToView);
}

export async function RenderEventUpdate(req: Request, res: Response) {
    const id = req.params.id;

    const userId = await GetEventById({id});

    /**
     * UPDATE LIST
     * data
     * admin
     * cancelacion
     */

    if(!userId) {
        req.flash(`err`, `Evento no encontrado.`);
        return res.redirect(`/users/list`);
    } 

    const ToView = {
        ubication: `Actualizar evento`,
        userData: userId 
    }

    return res.render(`event/update.hbs`, ToView);
}

export async function RenderEventUnique(req: Request, res: Response) {
    const id = req.params.id;
    const eventId = await GetEventById({id});

    if(!eventId) {
        req.flash(`err`, `Usuario no encontrado.`);
        return res.redirect(`/events/list`);
    } 

    const ToView = {
        ubication: `Ver evento`,
        eventData: eventId 
    }

    return res.render(`event/show.hbs`, ToView);
}
