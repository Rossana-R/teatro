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
const BaseController_1 = __importDefault(require("../BaseController"));
const EventModel_1 = __importDefault(require("../../models/event/EventModel"));
const TypeModel_1 = __importDefault(require("../../models/transacction/TypeModel"));
const CategoryModel_1 = __importDefault(require("../../models/transacction/CategoryModel"));
const TransactionModel_1 = __importDefault(require("../../models/transacction/TransactionModel"));
const auth_1 = require("../../middleware/auth");
const TransactionModel = new TransactionModel_1.default();
class ReportController extends BaseController_1.default {
    HandleEventReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const take = req.query.take ? Number(req.query.take) : 50;
            const month = req.query.month ? `${req.query.month}` : ``;
            const status = req.query.status ? `${req.query.status}` : ``;
            const renderFilter = [];
            const filter = [];
            if (month !== ``) {
                renderFilter.push({ key: `Mes`, value: `${month}` });
                filter.push({ admin_date: { contains: `-${month}-` } });
            }
            if (status !== ``) {
                renderFilter.push({ key: `Estado`, value: `${status}` });
                filter.push({ admin_status: { contains: status } });
            }
            const result = yield EventModel_1.default.ReportEvent({
                filter: {
                    AND: filter
                },
                skip,
                take
            });
            return res.render(`s/report/event.hbs`, {
                result: result.result,
                count: result.count,
                filter: renderFilter
            });
        });
    }
    HandleTransactionReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const TypePromise = TypeModel_1.default.GetPaginationType({ pag: 0, limit: 50 });
            const CategoryPromise = CategoryModel_1.default.GetPaginationCategory({ pag: 0, limit: 50 });
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const take = req.query.take ? Number(req.query.take) : 50;
            const date = req.query.date ? `${req.query.date}` : ``;
            const month = req.query.month ? `${req.query.month}` : ``;
            const type = req.query.type ? `${req.query.type}` : ``;
            const category = req.query.category ? `${req.query.category}` : ``;
            const renderFilter = [];
            const filter = [];
            if (type !== ``) {
                const typePromise = yield TypeModel_1.default.GetTypeById({ id: type });
                if (typePromise) {
                    renderFilter.push({ key: `Tipo`, value: `${typePromise.name}` });
                    filter.push({ typeId: typePromise.transactionTypeId });
                }
            }
            if (category !== ``) {
                const categoryPromise = yield CategoryModel_1.default.GetCategoryById({ id: category });
                if (categoryPromise) {
                    renderFilter.push({ key: `Categoria`, value: `${categoryPromise.name}` });
                    filter.push({ categoryId: categoryPromise.transactionCategoryId });
                }
            }
            if (month !== ``) {
                renderFilter.push({ key: `Mes`, value: `${month}` });
                filter.push({ date: { contains: `-${month}-` } });
            }
            if (date !== ``) {
                renderFilter.push({ key: `Fecha`, value: `${date}` });
                filter.push({ date: { equals: date } });
            }
            console.log(req.query);
            console.log(renderFilter);
            console.log(`category`);
            console.log(category);
            const result = yield TransactionModel.ReportTransaction({
                filter: {
                    AND: filter
                },
                skip,
                take,
            });
            return res.render(`s/report/transaction.hbs`, {
                result: result.result,
                count: result.count,
                filter: renderFilter,
                type: yield TypePromise,
                category: yield CategoryPromise,
            });
        });
    }
    LoadRouters() {
        this.router.get(`/report/transaction`, auth_1.OnSession, this.HandleTransactionReport);
        this.router.get(`/report/event`, auth_1.OnSession, this.HandleEventReport);
        return this.router;
    }
}
exports.default = new ReportController();
