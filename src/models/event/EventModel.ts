import AbstractModel from "../BaseModel";
import { CancelationCreate, EventCreate, RefReference } from "../../type/event";
import { Prisma } from "@prisma/client";

class EventModel extends AbstractModel {

    constructor () {
        super();
    }

    // get users pagination
    public async GetEvents({pag, limit=10, filter}: {pag:number, limit:number, filter: any}) {
        try {
            this.StartPrisma();
            const result = await this.prisma.event.findMany({
                where: filter ? filter : {},
                skip: pag*10,
                take: limit,
                include: {
                    cancelationRef: {
                        include: {
                            eventRef: true
                        }
                    }
                }
            });
            this.DistroyPrisma();
            return result;
        } catch (error) {
            console.log(error);
            return [];
        }

    }

    public async CountBy({ filter }: {filter:any}) {
        const result = await this.prisma.event.count({ where:filter });
        return result;
    }

    // crea usuario
    public async CreateEvent({data}:{data:EventCreate}) {
        this.StartPrisma();
        const result = await this.prisma.event.create({ 
            data: {
                ...data, 
                admin_code:`0000-0000-0000-00`,
            },

        }); 
        this.DistroyPrisma();
        this.StaticticsUpdate({});
        return result;
    }

    public async FindEventToDate({date}:{date:string}) {
        this.StartPrisma();
        const result = await this.prisma.event.findFirst({ where:{event_datetime_date:date} });
        this.DistroyPrisma();
        return result;
    }

    public async CountEventStatusAll() {
        this.StartPrisma();
        const resultPromise = [
            this.prisma.event.count(),
            this.prisma.event.count({ where:{ admin_status:`RECIBIDO` } }),
            this.prisma.event.count({ where:{ admin_status:`APROBADO` } }),
            this.prisma.event.count({ where:{ admin_status:`CANCELADO` } }),
            this.prisma.event.count({ where:{ admin_status:`FINALIZADO` } }),
        ];
        const all = await resultPromise[0];
        const recibido = await resultPromise[1];
        const aprovado = await resultPromise[2];
        const cancelado = await resultPromise[3];
        const finalizado = await resultPromise[4];
        return {all,aprovado,cancelado,finalizado,recibido};
    }

    // busca usuario por id
    public async FindEventById({id}: {id:string}) {
        this.StartPrisma();
        const result = await this.prisma.event.findFirst({ 
            where:{eventId:id},
            include: {
                cancelationRef: {
                    include: {
                        cancelationRef: true
                    }
                }
            }
         });
        this.DistroyPrisma();
        return result;
    }

    public async UpdateState({id,status}: {id:string,status:string}) {
        this.StartPrisma();
        const result = await this.prisma.event.update({ data:{ admin_status:status }, where:{eventId:id} });
        this.DistroyPrisma();
        return result;
    }

    public async CreateCancelation({data}:{data:CancelationCreate}) {
        this.StartPrisma();
        const result = this.prisma.cancelations.create({ data });
        this.DistroyPrisma();
        return result;
    }

    public async AddCancelationTime({data}:{data:RefReference}) {
        this.StartPrisma();
        const result = await this.prisma.cancelationRef.create({ data });
        this.DistroyPrisma();
        return result;
    }

    public async UpdateEvent({data, id}:{data:any,id: string}) {
        this.StartPrisma();
        const result = this.prisma.event.update({
            data,
            where: {eventId:id}
        })
        this.DistroyPrisma();
        return await result;
    }

    public async UpdateDate({ date, id }: {date:{date_start:string[],date_end:string[]}, id:string}) {
        this.StartPrisma();
        const result = this.prisma.event.update({
            data:{
                admin_date: date.date_start[0],
                admin_datetime_end: date.date_end[0],
                admin_datetime_start: date.date_start[0],
                event_datetime_date: date.date_start[0],
                event_datetime_tiem_end: date.date_end[1],
                event_datetime_tiem_start: date.date_start[1],
            },
            where: {eventId:id}
        })
        this.DistroyPrisma();
        return await result;
    }

    public async ReportEvent({filter, skip, take}: {filter:Prisma.EventWhereInput, skip:number, take:number}) {
        this.StartPrisma();
        const result = await this.prisma.event.findMany({
            where: filter,
            skip,
            take
        });
        const count = await this.prisma.event.count({
            where: filter
        })
        this.DistroyPrisma();
        return {result,count};
    }
}

export default new EventModel();
