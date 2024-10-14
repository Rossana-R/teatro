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
const GeneratePDFkit_1 = require("../../models/pdf/GeneratePDFkit");
const TransactionModel = new TransactionModel_1.default();
class ReportController extends BaseController_1.default {
    HandleEventReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const take = req.query.take ? Number(req.query.take) : 50;
            const status = req.query.status;
            const month = req.query.month;
            const fitlerRender = [];
            const filter = [];
            if (status) {
                filter.push({ admin_status: status });
                fitlerRender.push(`Estado: ${status}`);
            }
            else {
                fitlerRender.push(`Estado: TODOS`);
            }
            if (month) {
                filter.push({ admin_date: { contains: `-${month}-` } });
                fitlerRender.push(`Mes: ${month}`);
            }
            else {
                fitlerRender.push(`Mes: TODOS`);
            }
            const count = yield EventModel_1.default.CountBy({ filter: { AND: filter } });
            let pagTake = 20;
            const headers = [``, `fecha`, `Responsable`, `Estado`, `Caracter`];
            const rows = [];
            let i = 0;
            do {
                const result = yield EventModel_1.default.ReportEvent({
                    filter: {
                        AND: filter
                    },
                    skip: pagTake - 20,
                    take: pagTake
                });
                result.result.forEach((item, i) => {
                    rows.push([i.toString(), `${item.admin_date}`, `${item.fullname}`, `${item.admin_status}`, `${item.event_character}`]);
                });
                i++;
            } while (count > pagTake);
            const pdf = yield (0, GeneratePDFkit_1.pushPdf)({
                headers,
                rows,
                title: `Reporte`,
                filter: fitlerRender,
                count
            });
            return res.render(`s/report/event.hbs`, {
                // result:result.result,
                count: count,
                file: pdf,
                filter: fitlerRender,
            });
        });
    }
    HandleTransactionReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const TypePromise = TypeModel_1.default.GetPaginationType({ pag: 0, limit: 50 });
            const CategoryPromise = CategoryModel_1.default.GetPaginationCategory({ pag: 0, limit: 50 });
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            const take = req.query.take ? Number(req.query.take) : 50;
            // const status = req.query.status;
            const date = req.query.date;
            const type = req.query.type;
            const category = req.query.category;
            const fitlerRender = [];
            const filter = [];
            if (category && type) {
                const typeResult = yield TypeModel_1.default.GetTypeById({ id: type });
                const categoryResult = yield CategoryModel_1.default.GetCategoryById({ id: category });
                filter.push({ AND: [{ categoryId: category }, { typeId: type }] });
                fitlerRender.push(`Tipo: ${typeResult === null || typeResult === void 0 ? void 0 : typeResult.name}`);
                fitlerRender.push(`Categoria: ${categoryResult === null || categoryResult === void 0 ? void 0 : categoryResult.name}`);
            }
            else {
                if (type) {
                    const result = yield TypeModel_1.default.GetTypeById({ id: type });
                    filter.push({ typeId: type });
                    fitlerRender.push(`Tipo: ${result === null || result === void 0 ? void 0 : result.name}`);
                }
                else {
                    fitlerRender.push(`Tipo: TODOS`);
                }
                if (category) {
                    const result = yield CategoryModel_1.default.GetCategoryById({ id: category });
                    filter.push({ categoryId: category });
                    fitlerRender.push(`Categoria: ${result === null || result === void 0 ? void 0 : result.name}`);
                }
                else {
                    fitlerRender.push(`Categoria: TODOS`);
                }
            }
            const count = yield TransactionModel.CountAllBy({ filter: { AND: filter } });
            let pagTake = 20;
            const headers = [``, `Descripción`, `Monto`, `Fecha`];
            const rows = [];
            let i = 0;
            do {
                const result = yield TransactionModel.ReportTransaction({
                    filter: filter.length > 1 ? { AND: filter } : filter[0],
                    skip: pagTake - 20,
                    take: pagTake
                });
                result.result.forEach((item, i) => {
                    rows.push([i.toString(), `${item.description}`, `${item.mount}`, `${item.date}`]);
                });
                i++;
            } while (count > pagTake);
            const pdf = yield (0, GeneratePDFkit_1.pushPdf)({
                headers,
                rows,
                title: `Reporte`,
                filter: fitlerRender,
                count
            });
            const result = yield TransactionModel.ReportTransaction({
                filter: {
                    AND: filter
                },
                skip,
                take,
            });
            return res.render(`s/report/transaction.hbs`, {
                file: pdf,
                filter: fitlerRender,
                count,
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
