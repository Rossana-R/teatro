import { Request, Response } from "express";
import { CreateEventMld, GetEventByCode, GetEventById, GetEventCounts, GetEvents, UpdateDataEventMld } from "../model/event.model";
import { ChangeStatusEvent, UpdateDataAdminMld } from "../model/EventModel";
import { CompleteDataEvent } from "../type/event";


export async function EventsRender(req: Request, res: Response) {
    const events = await GetEvents();
    const count = await GetEventCounts();

    return res.render(`admin/event/events`, {events, count});
}

export async function EventByIdRender(req: Request, res: Response) {
    const event = await GetEventById({ id:req.params.id });

    return res.render(`admin/event/eventAdmin`, { evt:event });
}

export async function EventAporteRender (req: Request, res: Response) {
    const eventId = req.params.id;
    const event = await GetEventById({id:eventId}) as any | null;
    // console.log(event);
    if(!event) {
        req.flash(`err`, `no se pudo obtener el evento`);
        return res.redirect(`/events`);
    }
    const arancel = event.admin_arancel == `ARANCEL` ? true : false; 
    const aporte = event.admin_arancel == `APORTE` ? true : false; 
    const apoyo = event.admin_arancel == `APOYO INSTITUCIONAL` ? true : false; 

    event.admin_cancelation.mount_cancelation.forEach((key: any) => {
        console.log(key);
    });

    return res.render(`admin/event/eventAporte`, {event, arancel, aporte, apoyo});
}

export async function EventDataAdminRender (req: Request, res: Response) {
    const eventId = req.params.id;
    const event: any = await GetEventById({id:eventId});
    if(!event) {
        req.flash(`err`, `no se pudo obtener el evento`);
        return res.redirect(`/events`);
    }
    const arancel = event.admin_arancel == `ARANCEL` ? true : false; 
    const aporte = event.admin_arancel == `APORTE` ? true : false; 
    const apoyo = event.admin_arancel == `APOYO INSTITUCIONAL` ? true : false; 
    // console.log(event);

    return res.render(`admin/event/eventDataAdmin`, {event, arancel, aporte, apoyo});
}

export async function EventByCodeRender(req: Request, res: Response) {
    const event = await GetEventByCode({ code:req.params.code });

    return res.render(`public/eventregister`, { evt:event });
}

export async function UpdateStatusEvent(req: Request, res: Response) {
    try {
        const status = req.query.status;

        console.clear();
        console.log(req.params, req.query);
        
        if(!status) {
            req.flash(`El estado ${status} no está permitido.`);
            return res.redirect(`/events`);
        }

        const result = ChangeStatusEvent({ id:req.params.id, status:status });
        req.flash(`Evento actualizado a ${status}`);
        console.log(123);
        return res.redirect(`/events`);
    } catch (error) {
        console.log(error);
        req.flash(`err`, `Error temporal`);
        return res.redirect(`/events`);
    }
}

export async function UpdateEvent(req: Request, res: Response) {
    try {
        const evt = await GetEventById({id:req.params.id});
        if(!evt) {
            req.flash(`err`, `Evento no encontrado`);
            return res.redirect(`/events`);
        }
        console.log(evt);
        return res.render(`admin/event/eventUpdate`, {evt}); // render(`admin/event/eventUpdate`, {evt}); 
    } catch (error) {
        req.flash(`err`, `Evento no encontrado`);
        return res.redirect(`/events`);
    }  
}

export async function UpdateDataEvent(req: Request, res: Response) {
    const id = req.params.id;
    const body = req.body;

    console.log(body.event_area_coffe, body.event_area_room, body.event_area_vip)

    const event_area = {
        coffee_bar: req.body.event_area_coffe ? true : false,
        room: req.body.event_area_room ? true : false,
        vip:req.body.event_area_vip ? true : false
    }

    const event_datetime = {
        date: req.body.datetime,
        time_end: req.body.datetime_start,
        time_start: req.body.datetime_end,
    }

    const SaveEvent = { 
        event_area,

        address: body.address,
        ci: body.ci,
        email: body.email,
        fullname: body.fullname,
        phone: body.phone,

        event_type: req.body.event_type,
        event_character: req.body.event_character,
        event_cost: parseInt(`${req.body.event_cost}`),
        event_intro: req.body.event_intro ? true : false,
        event_name: req.body.event_name,
        event_quantity_people: parseInt(`${req.body.event_cuantity_people}`),

        event_datetime_date: event_datetime.date,
        event_datetime_time_end: event_datetime.time_end,
        event_datetime_time_start: event_datetime.time_start,

        /*admin_date: event_datetime.date,
        admin_code: ,
        admin_datetime_start: event_datetime.time_start,
        admin_datetime_end: event_datetime.time_end,
        admin_arancel: ``, // APORTE | APOYO INSTITUCIONAL
        admin_cancelation: {
            mount_total: 0,
            mount_cancelation: []
        },
        admin_observation: ``*/
    }
    await UpdateDataEventMld({id,evt:SaveEvent});

    return res.redirect(`/events`);
}

// export async function ReprogramEvent(req:Request, res:Response) {}

export async function UpdateAdminEvent(req: Request, res: Response) {
    try {
        const id = req.params.id as string;
        const {admin_code, admin_observation} = req.body as {admin_code:string, admin_observation:string};

        await UpdateDataAdminMld({id, data:{admin_code, admin_observation}});

        req.flash(`succ`, `Actualización exitosa.`)
        return res.redirect(`/event/${id}`);

    } catch (error) {
        req.flash(`err`, `Error temporal`);
        return res.redirect(`/dashboard`);
    }
}

export async function UpdateAdminPaymentEvent(req: Request, res: Response) {
    try {
        const id = req.params.id as string;
        const {admin_arancel} = req.body as {admin_arancel:string};

        await UpdateDataAdminMld({id, data:{admin_arancel}});

        req.flash(`succ`, `Registro exitoso.`)
        return res.redirect(`/event/${id}`);

    } catch (error) {
        req.flash(`err`, `Error temporal`);
        return res.redirect(`/dashboard`);
    }
}

export async function UpdateMethodAporteEvent(req: Request, res: Response) {
    try {
        const id = req.params.id as string;
        const {mount_total, description} = req.body;
        const getEvent = await GetEventById({id}) as CompleteDataEvent | null;

        if(!getEvent) {
            req.flash(`err`, `No se obtuvo el evento.`);
            return res.redirect(`/events`);
        }

        getEvent.admin_cancelation.mount_total = mount_total;
        getEvent.admin_cancelation.description = description;

        const test = await UpdateDataEventMld({id, evt:getEvent});

        req.flash(`succ`, `Evento actualizado.`);
        return res.redirect(`/event/${id}/aporte`);
    } catch (error) {
        console.log(error);
        req.flash(`err`, `Error temporal.`);
        return res.redirect(`/events`);
    }
}

export async function UpdateMoreAporteEvent(req: Request, res: Response) {
    try {
        const id = req.params.id as string;
        const {date, code, mount, percentage } = req.body as {date:string, code:string, mount:string, percentage:number};
        const getEvent = await GetEventById({id}) as any | null;

        if(!getEvent) {
            req.flash(`err`, `No se obtuvo el evento.`);
            return res.redirect(`/events`);
        }

        const RegisterCancelation = {code,date,mount,percentage:parseInt(`${percentage}`)};

        getEvent.admin_cancelation.mount_cancelation.push(RegisterCancelation);
        // console.log(getEvent);
        const test = await UpdateDataEventMld({id, evt:getEvent});

        req.flash(`succ`, `Evento actualizado.`);
        return res.redirect(`/event/${id}/aporte`);
    } catch (error) {
        console.log(error);
        req.flash(`err`, `Error temporal.`);
        return res.redirect(`/events`);
    }
}
