import eventSchema from "./schemas/event.schema"

export async function CountsAll() {
    const result = await eventSchema.count({});
    if(!result) return 0;
    return result;
}

export async function CountsEventsBy({by}:{by:any}) {
    const result = await eventSchema.count(by);
    return result; 
}

export async function GetEvents() {
    const result = await eventSchema.find();
    if(!result) return [];
    return result;
}

export async function GetRecentEvent() {
    const result = await eventSchema.find({
        admin_status: `RECIBIDO`
    });
    console.log(result);
    return result;
}

export async function GetEventById({id}: {id:string}) {
    const resultId = await eventSchema.findById(id);
    if(!resultId) return null;
    return resultId
}

export async function GetEventByCode({code}: {code:string}) {
    const resultCode = await eventSchema.findById({code});
    if(!resultCode) return null;
    return resultCode
}

export async function ChangeStatusEvent({id, status}: {id:string, status:string}) {
    // CANCEL // APPROVED // REPROGRAM // END
    const result = await eventSchema.findByIdAndUpdate(id, {"$set":{admin_status:status}});
    if(!result) return false;
    return true;
}

export async function UpdateDataAdminMld({id, data}: {id:string,data:any}) {
    const result = await eventSchema.findByIdAndUpdate(id, {"$set":data})
    return result;
}

export async function UpdateStatusEventMdl({id, status}: {id:string, status:string}) {
    const result = await eventSchema.findByIdAndUpdate(id, {"$set":{admin_status:status}});
    return result;
}

export async function GetEventToDate({date}:{date:string}) {
    const result = eventSchema.findOne({admin_date:date});
    if(!result) return null;

    return result;
}


