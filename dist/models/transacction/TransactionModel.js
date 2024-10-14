"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = __importDefault(require("../BaseModel"));
class TransactionModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    CountAllTransactions(_a) {
        return __awaiter(this, arguments, void 0, function* ({}) {
            this.StartPrisma();
            const countALl = this.prisma.transaction.count({});
            this.DistroyPrisma();
            return yield countALl;
        });
    }
    Create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = this.prisma.transaction.create({ data });
            this.DistroyPrisma();
            return result;
        });
    }
    Update(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, id }) {
            this.StartPrisma();
            const result = this.prisma.transaction.update({ data, where: { transactionId: id } });
            this.DistroyPrisma();
            return result;
        });
    }
    GetById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.transaction.findFirst({ where: { transactionId: id } });
            const type = this.prisma.transactionType.findFirst({ where: { transactionTypeId: result === null || result === void 0 ? void 0 : result.typeId } });
            const category = this.prisma.transactionCategory.findFirst({ where: { transactionCategoryId: result === null || result === void 0 ? void 0 : result.categoryId } });
            const user = this.prisma.user.findFirst({ where: { userId: result === null || result === void 0 ? void 0 : result.createId } });
            const newResult = Object.assign(Object.assign({}, result), { typeReferende: yield type, categoryReferende: yield category, createReference: yield user });
            this.DistroyPrisma();
            return newResult;
        });
    }
    CountAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.StartPrisma();
            const result = yield this.prisma.transactionType.count();
            this.DistroyPrisma();
            return result;
        });
    }
    CountAllBy(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            this.StartPrisma();
            const result = yield this.prisma.transaction.count({ where: filter });
            this.DistroyPrisma();
            return result;
        });
    }
    GetPagination(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit }) {
            this.StartPrisma();
            const result = yield this.prisma.transaction.findMany({
                skip: pag * limit,
                take: limit,
            });
            this.DistroyPrisma();
            return result;
        });
    }
    ReportTransaction(_a) {
        return __awaiter(this, arguments, void 0, function* ({ skip, take, filter }) {
            this.StartPrisma();
            const result = yield this.prisma.transaction.findMany({
                where: filter,
                skip,
                take
            });
            const count = yield this.prisma.transaction.count({ where: filter });
            this.DistroyPrisma();
            return { result, count };
        });
    }
}
exports.default = TransactionModel;
