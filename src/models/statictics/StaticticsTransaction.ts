import { connect } from "mongoose";
import AbstractModel from "../BaseModel";

class StaticticsTransaction extends AbstractModel {

    constructor () {
        super();
    }

    // crea
    public async create({num,name,currentMonth}:{currentMonth?:number,num: number,name:string}) {
        const year = this.getYear();
        const month = currentMonth ? currentMonth : this.getMonth();
        this.StartPrisma();

        const result = await this.prisma.staticticsObjectsYear.create({
            data: {
                year,
                objectName: name,
                total_month_1: month == 1 ? num : 0,
                total_month_2: month == 2 ? num : 0,
                total_month_3: month == 3 ? num : 0,
                total_month_4: month == 4 ? num : 0,
                total_month_5: month == 5 ? num : 0,
                total_month_6: month == 6 ? num : 0,
                total_month_7: month == 7 ? num : 0,
                total_month_8: month == 8 ? num : 0,
                total_month_9: month == 9 ? num : 0,
                total_month_10: month == 10 ? num : 0,
                total_month_11: month == 11 ? num : 0,
                total_month_12: month == 12 ? num : 0
            }
        });

        this.DistroyPrisma();

        return result;
    }

    // return statictics
    public async conectOrCreate({name, num,currentMonth}:{currentMonth?:number,name:string, num:number}) {
        const year = this.getYear();

        this.StartPrisma();
        console.log(year, name, num);
        const result = await this.prisma.staticticsObjectsYear.findFirst({
            where: {
                AND: [
                    {objectName:name},
                    {year}
                ]
            }
        });
        console.log(year);
        console.log(result);
        this.DistroyPrisma();

        if(result) {
            const id = result.staticticsForYearId;
            this.update({id,name,num,currentMonth});
            return result;
        }

        const create = await this.create({ name,num,currentMonth });
        return create;
    }
    
    public async getForYear({limit=3,year}:{limit?:number,year:number}) {
        this.StartPrisma();
        const result = await this.prisma.staticticsObjectsYear.findMany({
            skip: 0,
            take: limit,
        })
        this.DistroyPrisma();
        return result;
    }
 
    // incrementa
    public async update({name, num,id,currentMonth}:{currentMonth?:number,name:string, num:number,id:string}) {
        const year = this.getYear();
        const month = currentMonth ? currentMonth : this.getMonth();
        this.StartPrisma();

        const result = await this.prisma.staticticsObjectsYear.update({
            data: {
                year,
                objectName: name,
                total_month_1: month == 1 ? {increment:num} : {increment:0},
                total_month_2: month == 2 ? {increment:num} : {increment:0},
                total_month_3: month == 3 ? {increment:num} : {increment:0},
                total_month_4: month == 4 ? {increment:num} : {increment:0},
                total_month_5: month == 5 ? {increment:num} : {increment:0},
                total_month_6: month == 6 ? {increment:num} : {increment:0},
                total_month_7: month == 7 ? {increment:num} : {increment:0},
                total_month_8: month == 8 ? {increment:num} : {increment:0},
                total_month_9: month == 9 ? {increment:num} : {increment:0},
                total_month_10: month == 10 ? {increment:num} : {increment:0},
                total_month_11: month == 11 ? {increment:num} : {increment:0},
                total_month_12: month == 12 ? {increment:num} : {increment:0}
            },
            where: {
                staticticsForYearId: id
            }
        });

        this.DistroyPrisma();

        return result;
    }

    public getYear() {
        const date = new Date();
        return date.getFullYear();
    }

    public getMonth() {
        const date = new Date();
        return date.getMonth()+1;
    }
}

export default new StaticticsTransaction();
