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

export async function GetEventCounts() {
    const result = await eventSchema.count({});
    return result;
}

export async function GetEvents() {
    const result = await eventSchema.find();
    return result;
}

export async function GetEventById({id}:{id:string}) {
    const result = await eventSchema.findOne({_id:id});
    return result;
}

export async function GetEventByCode({code}:{code:string}) {
    const result = await eventSchema.findOne({admin_code:code});
    return result;
}
