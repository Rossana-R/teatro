import AbstractModel from "../BaseModel";
import { CancelationCreate, EventCreate, RefReference } from "../../type/event";
import { TurnCreate } from "../../type/turn";

class EventModel extends AbstractModel {

    constructor () {
        super();
    }

    public async create(data: TurnCreate) {
        this.StartPrisma();
        const result = await this.prisma.turn.create({data});
        this.DistroyPrisma();
        return result;
    }

    public async count() {
        this.StartPrisma();
        const result = await this.prisma.turn.count();
        this.DistroyPrisma();
        return result;
    }

    public async findAll({limit,pag,filter}:{pag:number,limit:number,filter?:any}) {
        this.StartPrisma();
        const result = this.prisma.turn.findMany({ take: pag*10, skip: limit, });
        this.DistroyPrisma();
        return result;
    }

    public async findById() {}

    public async update() {}

    public async delete() {}

}

export default new EventModel();
