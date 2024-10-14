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
class CategoryModel extends TransactionModel_1.default {
    constructor() {
        super();
    }
    CreateCategory(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = this.prisma.transactionCategory.create({ data });
            this.DistroyPrisma();
            return result;
        });
    }
    UpdateCategory(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, id }) {
            this.StartPrisma();
            const result = this.prisma.transactionCategory.update({ data, where: { transactionCategoryId: id } });
            this.DistroyPrisma();
            return result;
        });
    }
    GetCategoryById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.transactionCategory.findFirst({
                where: {
                    transactionCategoryId: id
                },
                include: {
                    createReference: true
                }
            });
            this.DistroyPrisma();
            return result;
        });
    }
    GetPaginationCategory(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit }) {
            this.StartPrisma();
            const result = yield this.prisma.transactionCategory.findMany({
                include: {
                    createReference: true,
                },
                skip: pag * limit,
                take: limit,
            });
            this.DistroyPrisma();
            return result;
        });
    }
    CountAllCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            this.StartPrisma();
            const result = yield this.prisma.transactionCategory.count();
            this.DistroyPrisma();
            return result;
        });
    }
}
exports.default = new CategoryModel;
