import eventSchema from "./schemas/event.schema";
import { CreateEvent } from "../type/event.d";

export async function CreateEventMld({evt}: {evt:CreateEvent}) {
    const result = await eventSchema.create(evt);
    return result;
}

export async function UpdateDataEventMld({id,evt}: {id:string,evt:any}) {
    const result = await eventSchema.findByIdAndUpdate(id,{"$set":evt});
    return result;
}


export async function ValidEventDate({date}: {date:string}) {
    const result = await eventSchema.find({ event_datetime:{date} });
    return result;
}

export async function GetEvents({pag}:{pag:number}) {
    const result = await eventSchema.find().skip(pag*10).limit(10);
    return result;
}
