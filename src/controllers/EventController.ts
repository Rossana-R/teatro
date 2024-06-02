import { Request, Response } from "express";
import { CreateEventMld, UpdateDataEventMld } from "../model/event.model";
import { ChangeStatusEvent, GetEventById, UpdateDataAdminMld, UpdateStatusEventMdl } from "../model/EventModel";
import { CompleteDataEvent, EventDescription, CreateEvent as EventType } from "../type/event.d";


export async function CreateEvent(req: Request, res: Response) {
    try {   
        const {
            fullname, address, ci, email, phone,

            event_type, event_name, event_quantity_people, event_character, event_intro, event_cost,

            event_datetime_time_start, event_datetime_time_end,

            admin_code, admin_arancel, admin_observation,

            coffee_bar, room, vip
        } = req.body;

        const evt: EventType = {
            fullname, address, ci, email, phone,

            event_type, event_name, event_quantity_people, event_character, event_cost,
            event_intro: event_intro ? true : false,

            event_datetime_date: event_datetime_time_start.split(`T`)[0],
            event_datetime_time_start,
            event_datetime_time_end,

            admin_date:event_datetime_time_start.split(`T`)[0], 
            admin_code, 
            admin_datetime_start: event_datetime_time_start, 
            admin_datetime_end: event_datetime_time_end, 
            admin_arancel, 
            admin_observation,

            event_area: {
                coffee_bar: coffee_bar ? true : false,
                room: room ? true : false,
                vip: vip ? true : false
            },

            admin_cancelation: {
                description: ``,
                mount_cancelation: [],
                mount_total: 0,
            }
        }

        const result = await CreateEventMld({evt});

        req.flash(`succ`, `Evento registrado`);
        return res.redirect(`/events/list`);

    } catch (error) {
        req.flash(`err`, `Error temporal, intente más tarde.`)
        return res.redirect(`/events`);
    }

}

export async function UpdateEvent(req: Request, res: Response) {
    try {   
        const {
            fullname, address, ci, email, phone,

            event_type, event_name, event_quantity_people, event_character, event_intro, event_cost,

            event_datetime_time_start, event_datetime_time_end,

            admin_code, admin_arancel, admin_observation,

            coffee_bar, room, vip
        } = req.body;

        const id = req.params.id;

        const evt: EventType = {
            fullname, address, ci, email, phone,

            event_type, event_name, event_quantity_people, event_character, event_cost,
            event_intro: event_intro ? true : false,

            event_datetime_date: event_datetime_time_start.split(`T`)[0],
            event_datetime_time_start,
            event_datetime_time_end,

            admin_date:event_datetime_time_start.split(`T`)[0], 
            admin_code, 
            admin_datetime_start: event_datetime_time_start, 
            admin_datetime_end: event_datetime_time_end, 
            admin_arancel, 
            admin_observation,

            event_area: {
                coffee_bar: coffee_bar ? true : false,
                room: room ? true : false,
                vip: vip ? true : false
            },

            admin_cancelation: {
                description: ``,
                mount_cancelation: [],
                mount_total: 0,
            }
        }

        const result = await UpdateDataEventMld({evt, id});

        console.log(id);
        console.log(event_datetime_time_start, event_datetime_time_end)
        console.log(result);

        req.flash(`succ`, `Evento registrado`);
        return res.redirect(`/events/list`);

    } catch (error) {
        req.flash(`err`, `Error temporal, intente más tarde.`)
        return res.redirect(`/events`);
    }

}

export async function UpdateStatusEvent(req: Request, res: Response) {
    try {   
        const id = req.params.id;
        const status = req.query.status;

        const findEvent = await GetEventById({id}) as CompleteDataEvent | null;

        if(null == findEvent) {
            req.flash(`err`, `No se obtuvo el evento.`);
            return res.redirect(`/events`);
        }

        if(status == `CANCELADO`) {
            await UpdateStatusEventMdl({id,status});
            req.flash(`err`, `El evento cancelado.`);
            return res.redirect(`/events/list`); 
        }

        const ev = {
            month: Number(`${findEvent.admin_date}`.split(`-`)[1]),
            day: Number(`${findEvent.admin_date}`.split(`-`)[2]),
            year: Number(`${findEvent.admin_date}`.split(`-`)[0])
        }

        const date = new Date();
        const now = {
            month: Number(`${date.getMonth()}`)+1,
            day: Number(`${date.getDate()}`),
            year: Number(`${date.getFullYear()}`)
        }

        if(status === `FINALIZADO`) {

            if(!(ev.year == now.year && ev.month == now.month && ev.day == now.day)) {
                req.flash(`err`, `No puedes finalizar el evento.`);
                return res.redirect(`/events/list`);
            }

            await UpdateStatusEventMdl({id,status});
            req.flash(`succ`, `Evento finalizado.`);
            return res.redirect(`/events/list`);
        }

        if(now.year < ev.year) {
            req.flash(`err`, `El evento está en fecha pasada. año`);
            return res.redirect(`/events/list`); 
        }

        if(now.month < ev.month) {
            req.flash(`err`, `El evento está en fecha pasada. mes`);
            return res.redirect(`/events/list`); 
        }

        // month fine 
        if(now.month == ev.month) {
            if(now.day > ev.day) {
                req.flash(`err`, `El evento está en fecha pasada. día/mes`);
                return res.redirect(`/events/list`); 
            }
        }

        // all fine
        await UpdateStatusEventMdl({id,status});
        req.flash(`succ`, `Evento cambiado a ${status}`);
        return res.redirect(`/events/list`);       

    } catch (error) {
        req.flash(`err`, `Error temporal, intente más tarde.`)
        return res.redirect(`/events`);
    }

}

export async function UpdateAdminEvent(req: Request, res: Response) {
    const {admin_observation, admin_code} = req.body;
    const id = req.params.id;

    const result = await UpdateDataAdminMld({id, data:{admin_observation, admin_code}});
    
    req.flash(`succ`, `Evento actualizado. ${admin_code}`);
    return res.redirect(`/events/list`);
}

export async function UpdateSetPaymentEvent(req: Request, res: Response) {
    const {description, mount_total, mount_unity} = req.body;
    const id = req.params.id;

    await UpdateDataAdminMld({ id, data:{admin_cancelation:{description, mount_total, mount_unity}} });

    req.flash(`succ`, `Evento actualizado.`);
    return res.redirect(`/event/${id}/show`);
}

export async function UpdateSetPaymentAvanceEvent(req: Request, res: Response) {
    const {date,code,mount,percentage, mount_unity, mount_total,description} = req.body;
    const id = req.params.id;

    const findEvent = await GetEventById({id}) as CompleteDataEvent | null;

    if(null == findEvent) {
        req.flash(`err`, `Evento no encontrado`);
        return res.redirect(`/events/list`);
    }

    const SetMount = {date,code,mount,percentage:Number(percentage)} as {date:string,code:string,mount:string,percentage:number};
    findEvent.admin_cancelation.mount_cancelation.push(SetMount);

    await UpdateDataAdminMld({ id, data:{admin_cancelation:{mount_unity, mount_total,description,mount_cancelation:findEvent.admin_cancelation.mount_cancelation}} });

    req.flash(`succ`, `Evento actualizado.`);
    return res.redirect(`/event/${id}/show`);
}
