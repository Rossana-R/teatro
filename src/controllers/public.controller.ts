import { Request, Response } from "express";
import { CreateEventMld, ValidEventDate } from "../model/event.model";
import { CreateEvent, EventArea, EventDescription } from "../type/event.d";
import { GererateCode } from "../utils/utils";

export async function RegisterEvent(req: Request, res: Response) {
    const {test, start, end} = req.query;

    if(test && start && end) {
        const date = start.split(`T`)[0];
        const timeStart = start.split(`T`)[1];
        const timeEnd = end.split(`T`)[1];

        console.log(`
            evento pautado para: ${date}
            inicio: ${timeStart}
            salida: ${timeEnd}
        `);
        const resultDate = await ValidEventDate({ date });
        return res.status(200).json({ response:`VALID_DATE_EVENT`, body:{resultDate} });
    }

    const body = req.body;

    const event_area:EventArea = {
        coffee_bar: req.body.event_area_coffe ? true : false,
        room: req.body.event_area_room ? true : false,
        vip:req.body.event_area_vip ? true : false
    }

    const event_datetime = {
        date: req.body.datetime,
        time_end: req.body.datetime_start,
        time_start: req.body.datetime_end,
    }

    const SaveEvent:CreateEvent = { 
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

        admin_date: event_datetime.date,
        admin_code: GererateCode(),
        admin_datetime_start: event_datetime.time_start,
        admin_datetime_end: event_datetime.time_end,
        admin_arancel: ``, // APORTE | APOYO INSTITUCIONAL
        admin_cancelation: {
            mount_total: 0,
            description: ``,
            mount_cancelation: []
        },
        admin_observation: ``
    }
    await CreateEventMld({evt:SaveEvent});

    return res.redirect(`/public/event/${SaveEvent.admin_code}`);
} 
