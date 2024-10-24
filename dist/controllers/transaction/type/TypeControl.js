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
const BaseController_1 = __importDefault(require("../../BaseController"));
const auth_1 = require("../../../middleware/auth");
const TypeModel_1 = __importDefault(require("../../../models/transacction/TypeModel"));
class TypeController extends BaseController_1.default {
    constructor() {
        super();
    }
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.query.pag | 0;
            const limit = req.query.limit | 10;
            const type = TypeModel_1.default.GetPaginationType({ pag, limit });
            const countPromise = TypeModel_1.default.CountAll();
            const Params = {
                list: yield type,
                next: `/transaction/type/?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/transaction/type/?pag=${pag - 1}`,
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
            return res.render(`s/transaction/type/list.hbs`, Params);
        });
    }
    RenderCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const Params = {};
            return res.render(`s/transaction/type/create.hbs`, Params);
        });
    }
    RenderUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = TypeModel_1.default.GetTypeById({ id });
            const Params = {
                data: yield data
            };
            return res.render(`s/transaction/type/update.hbs`, Params);
        });
    }
    CreatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { name, description } = req.body;
                const data = {
                    name, description,
                    createId: user.userId,
                };
                yield TypeModel_1.default.CreateType({ data });
                req.flash(`succ`, `Creado exitoso.`);
                return res.redirect(`/transaction/type`);
            }
            catch (error) {
                req.flash(`error`, `Error al crear.`);
                return res.redirect(`/transaction/type`);
            }
        });
    }
    UpdatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = req.params.id;
                const { name, description, code, kg, gr } = req.body;
                const data = { name, description,
                    createId: user.userId,
                };
                yield TypeModel_1.default.UpdateType({ id, data });
                req.flash(`succ`, `Creado exitoso.`);
                return res.redirect(`/transaction/type`);
            }
            catch (error) {
                req.flash(`error`, `Error al crear.`);
                return res.redirect(`/transaction/type`);
            }
        });
    }
    LoadRoutes() {
        // this.router.get(`/transaction/type`, OnSession, this.RenderDashboard);
        this.router.get(`/transaction/type/`, auth_1.OnSession, this.RenderList);
        this.router.get(`/transaction/type/create`, auth_1.OnSession, this.RenderCreate);
        this.router.get(`/transaction/type/update/:id`, auth_1.OnSession, this.RenderUpdate);
        this.router.post(`/transaction/type/create`, auth_1.OnSession, this.CreatePost);
        this.router.post(`/transaction/type/update/:id`, auth_1.OnSession, this.UpdatePost);
        return this.router;
    }
}
exports.default = new TypeController();
