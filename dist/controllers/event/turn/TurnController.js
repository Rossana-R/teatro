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
const TurnModel_1 = __importDefault(require("../../../models/event/TurnModel"));
const auth_1 = require("../../../middleware/auth");
class UserController extends BaseController_1.default {
    constructor() {
        super();
    }
    Create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            body.time_end = body.time_end.split(`T`)[1];
            body.time_start = body.time_start.split(`T`)[1];
            yield TurnModel_1.default.create(body);
            req.flash(`succ`, `Turno creado`);
            return res.redirect(`/turn`);
        });
    }
    Find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.params.pag | 0;
            const limit = req.params.limit | 10;
            const turns = TurnModel_1.default.findAll({ pag, limit });
            const countPromise = TurnModel_1.default.count();
            const Params = {
                list: yield turns,
                next: `/turn/list?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/turn/list?pag=${pag - 1}`,
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
            return res.render(`s/event/turn/list.hbs`, Params);
        });
    }
    RenderCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.render(`s/event/turn/create.hbs`);
        });
    }
    LoadRouters() {
        this.router.post(`/turn`, auth_1.OnSession, this.Create);
        this.router.get(`/turn`, auth_1.OnSession, this.Find);
        this.router.get(`/turn/create`, auth_1.OnSession, this.RenderCreate);
        ///event/{{data.eventId}}/set/payment
        return this.router;
    }
}
exports.default = new UserController();
