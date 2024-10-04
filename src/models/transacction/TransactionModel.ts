import { connect } from "mongoose";
import { TransactionCreate } from "../../type/transaction";
import AbstractModel from "../BaseModel";
import { Prisma } from "@prisma/client";

class TransactionModel extends AbstractModel {

    constructor () {
        super();
    }

    public async CountAllTransactions({}:{}) {
        this.StartPrisma();
        const countALl = this.prisma.transaction.count({});
        this.DistroyPrisma();
        return await countALl
    }

    public async Create({ data }: { data: TransactionCreate }) {
        this.StartPrisma();
        const result = this.prisma.transaction.create({ data });
        this.DistroyPrisma();
        return result;
    }

    public async Update({ data, id }: {data: TransactionCreate, id: string}) {
        this.StartPrisma();
        const result = this.prisma.transaction.update({ data, where:{transactionId:id} });
        this.DistroyPrisma();
        return result;
    }

    public async GetById({ id }: {id:string}) {
        this.StartPrisma();
        const result = await this.prisma.transaction.findFirst({ where:{transactionId:id} });
        const type = this.prisma.transactionType.findFirst({ where:{ transactionTypeId:result?.typeId } });
        const category = this.prisma.transactionCategory.findFirst({ where:{ transactionCategoryId:result?.categoryId } });
        const user = this.prisma.user.findFirst({ where:{ userId:result?.createId } });

        const newResult = {
            ...result,
            typeReferende: await type,
            categoryReferende: await category,
            createReference: await user,
        }
        this.DistroyPrisma();
        return newResult;
    }

    public async CountAll() {
        this.StartPrisma();
        const result = await this.prisma.transactionType.count();
        this.DistroyPrisma();
        return result;
    } 

    public async GetPagination({ pag, limit }: {pag:number, limit:number}) {
        this.StartPrisma();
        const result = await this.prisma.transaction.findMany({
            skip: pag*limit,
            take: limit,
        });
        this.DistroyPrisma();
        return result;
    }

    public async ReportTransaction({skip,take,filter}:{skip:number,take:number,filter:Prisma.TransactionWhereInput}) {
        this.StartPrisma();
        const result = await this.prisma.transaction.findMany({
            where: filter,
            skip,
            take
        });
        const count = await this.prisma.transaction.count({ where: filter });
        this.DistroyPrisma();
        return {result, count};
    }
}

export default TransactionModel;
