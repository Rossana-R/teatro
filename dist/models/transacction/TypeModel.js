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
const TransactionModel_1 = __importDefault(require("./TransactionModel"));
class TypeModel extends TransactionModel_1.default {
    constructor() {
        super();
    }
    CreateType(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = this.prisma.transactionType.create({ data });
            this.DistroyPrisma();
            return result;
        });
    }
    UpdateType(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, id }) {
            this.StartPrisma();
            const result = this.prisma.transactionType.update({ data, where: { transactionTypeId: id } });
            this.DistroyPrisma();
            return result;
        });
    }
    GetTypeById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.transactionType.findFirst({
                where: { transactionTypeId: id },
            });
            this.DistroyPrisma();
            return result;
        });
    }
    GetPaginationType(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit }) {
            this.StartPrisma();
            const result = yield this.prisma.transactionType.findMany({
                skip: pag * limit,
                take: limit,
            });
            this.DistroyPrisma();
            return result;
        });
    }
    CountTypeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.StartPrisma();
            const result = yield this.prisma.transactionType.count();
            this.DistroyPrisma();
            return result;
        });
    }
}
exports.default = new TypeModel;
