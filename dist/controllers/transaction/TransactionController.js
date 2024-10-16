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
const auth_1 = require("../../middleware/auth");
const TransactionModel_1 = __importDefault(require("../../models/transacction/TransactionModel"));
const CategoryModel_1 = __importDefault(require("../../models/transacction/CategoryModel"));
const TypeModel_1 = __importDefault(require("../../models/transacction/TypeModel"));
const StaticticsTransaction_1 = __importDefault(require("../../models/statictics/StaticticsTransaction"));
// import { Languaje, TypesFlash } from "../../var";
const TransactionModel = new TransactionModel_1.default;
class TransactionController extends BaseController_1.default {
    constructor() {
        super();
    }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.query.pag | 0;
            const limit = req.query.limit | 10;
            const transaction = TransactionModel.GetPagination({ pag, limit });
            const countPromise = TransactionModel.CountAllTransactions({});
            const Params = {
                list: yield transaction,
                next: `/transaction/?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/transaction/?pag=${pag - 1}`,
                count: yield countPromise,
                nowTotal: ``,
                requirePagination: false,
                nowPath: pag,
                nowPathOne: pag != 0 ? true : false,
                nowPathEnd: false,
            };
            Params.nowTotal = `${Params.list.length + (pag * 10)} / ${Params.count}`;
            Params.nowPathEnd = (Params.list.length - 9) > 0 ? true : false;
            Params.requirePagination = Params.count > 10 ? true : false;
            return res.render(`s/transaction/list.hbs`, Params);
        });
    }
    RenderCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const types = TypeModel_1.default.GetPaginationType({ pag: 0, limit: 100 });
            const category = CategoryModel_1.default.GetPaginationCategory({ pag: 0, limit: 100 });
            const Params = {
                types: yield types,
                category: yield category
            };
            return res.render(`s/transaction/create.hbs`, Params);
        });
    }
    RenderUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = TransactionModel.GetById({ id });
            const Params = {
                data: yield data
            };
            return res.render(`s/transaction/update.hbs`, Params);
        });
    }
    CreatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { categoryId, date, mount, typeId, description } = req.body;
                const categoryPromise = CategoryModel_1.default.GetCategoryById({ id: categoryId });
                const data = {
                    description,
                    categoryId,
                    date,
                    mount: parseFloat(mount),
                    typeId,
                    createId: user.userId,
                };
                yield TransactionModel.Create({ data });
                const category = yield categoryPromise;
                console.log(date);
                console.log(date.split(`-`)[1]);
                const month = date.split(`-`)[1];
                console.log(month);
                yield StaticticsTransaction_1.default.conectOrCreate({ name: `${category === null || category === void 0 ? void 0 : category.name}`, num: data.mount, currentMonth: Number(month) });
                req.flash(`succ`, `Creado exitoso.`);
                return res.redirect(`/transaction`);
            }
            catch (error) {
                console.log(error);
                req.flash(`error`, `Error al crear.`);
                return res.redirect(`/transaction`);
            }
        });
    }
    UpdatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = req.params.id;
                const { categoryId, date, mount, typeId, description } = req.body;
                const data = {
                    description,
                    categoryId,
                    date,
                    mount: parseInt(mount),
                    typeId,
                    createId: user.userId,
                };
                yield TransactionModel.Update({ id, data });
                req.flash(`succ`, `Creado exitoso`);
                return res.redirect(`/transaction`);
            }
            catch (error) {
                req.flash(`error`, `Error al Crear`);
                return res.redirect(`/transaction`);
            }
        });
    }
    LoadRoutes() {
        this.router.get(`/transaction/`, auth_1.OnSession, this.RenderList);
        this.router.get(`/transaction/create`, auth_1.OnSession, this.RenderCreate);
        this.router.get(`/transaction/update/:id`, auth_1.OnSession, this.RenderUpdate);
        this.router.post(`/transaction/create`, auth_1.OnSession, this.CreatePost);
        this.router.post(`/transaction/update/:id`, auth_1.OnSession, this.UpdatePost);
        return this.router;
    }
}
exports.default = new TransactionController();
