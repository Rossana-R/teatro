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
const TurnModel_1 = __importDefault(require("../../models/event/TurnModel"));
const TransactionModel_1 = __importDefault(require("../../models/transacction/TransactionModel"));
const auth_1 = require("../../middleware/auth");
const TransactionModel = new TransactionModel_1.default();
class UserController extends BaseController_1.default {
    DashboardController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactionsCountPromise = TransactionModel.CountAllTransactions({});
            const transsactions = yield transactionsCountPromise;
            return res.render(`s/event/dashboard.hbs`, {
                transactionCount: transsactions,
                ubication: `Resumen`,
            });
        });
    }
    StaticticsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.render(`s/event/statictics.hbs`, {
                ubication: `Resumen`,
            });
        });
    }
    // render list
    RenderList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pag = req.params.pag | 0;
            const limit = req.params.limit | 10;
            const date = req.body.date;
            const status = req.body.status;
            const filter = {};
            if (status && status !== "ALL")
                filter.admin_status = status;
            if (date)
                filter.admin_date = date;
            const events = EventModel_1.default.GetEvents({ pag, limit, filter });
            const countPromise = EventModel_1.default.CountBy({ filter });
            const Params = {
                list: yield events,
                next: `/event/list?pag=${pag + 1}`,
                previous: pag == 0 ? null : `/event/list?pag=${pag - 1}`,
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
            return res.render(`s/event/list.hbs`, Params);
        });
    }
    // render create
    RenderCreate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const Params = {};
            const turns = yield TurnModel_1.default.findAll({ limit: 100, pag: 1 });
            Params.turn = turns;
            return res.render(`s/event/create.hbs`, Params);
        });
    }
    RenderCreateReserved(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const Params = {};
            const turns = yield TurnModel_1.default.findAll({ limit: 100, pag: 1 });
            Params.turn = turns;
            return res.render(`p/reserved.hbs`, Params);
        });
    }
    // render reprogramming
    RenderReprogramming(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const event = yield EventModel_1.default.FindEventById({ id });
            if (null == event) {
                req.flash(`err`, `Evento no encontrado.`);
                return res.redirect(`/event/list`);
            }
            const Params = { data: event };
            return res.render(`s/event/reprograming.hbs`, Params);
        });
    }
    // render show and update
    RenderShow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const event = yield EventModel_1.default.FindEventById({ id });
            if (null == event) {
                req.flash(`err`, `Evento no encontrado.`);
                return res.redirect(`/event/list`);
            }
            const Params = { data: event };
            return res.render(`s/event/show.hbs`, Params);
        });
    }
    LogicReprogramming(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { event_datetime_time_start, event_datetime_time_end } = req.body;
            const id = req.params.id;
            const date_start = event_datetime_time_start.split(`T`);
            const date_end = event_datetime_time_end.split(`T`);
            const eventFoundPromise = EventModel_1.default.FindEventToDate({ date: date_start[0] });
            const eventFound2Promise = EventModel_1.default.FindEventToDate({ date: date_end[0] });
            const eventFound = yield eventFoundPromise;
            const eventFound2 = yield eventFound2Promise;
            if (eventFound || eventFound2) {
                req.flash(`err`, `Fecha ocupada`);
                return res.redirect(`/event/${id}/reprograming`);
            }
            yield EventModel_1.default.UpdateDate({ date: { date_end, date_start }, id: id });
            req.flash(`succ`, `Evento reprogramado`);
            return res.redirect(`/event/${id}/update`);
        });
    }
    // logic register
    CreateEventPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullname, address, ci, email, phone, event_type, event_name, event_quantity_people, event_character, event_intro, event_cost, event_datetime_time_start, event_datetime_time_end, admin_code, coffee_bar, room, vip, status } = req.body;
                const evt = {
                    fullname, address, ci, email, phone,
                    event_quantity_people: Number(event_quantity_people),
                    event_type, event_name, event_character, event_cost,
                    event_intro: event_intro ? true : false,
                    event_datetime_date: event_datetime_time_start.split(`T`)[0],
                    event_datetime_tiem_start: event_datetime_time_start,
                    event_datetime_tiem_end: event_datetime_time_end,
                    admin_date: event_datetime_time_start.split(`T`)[0],
                    admin_code,
                    admin_datetime_start: event_datetime_time_start,
                    admin_datetime_end: event_datetime_time_end,
                    admin_status: status ? status : `RECIBIDO`,
                    coffe_bar: coffee_bar ? true : false,
                    room: room ? true : false,
                    vip: vip ? true : false,
                };
                yield EventModel_1.default.CreateEvent({ data: evt });
                req.flash(`succ`, `Evento creado`);
                if (!req.user) {
                    return res.redirect(`/`);
                }
                return res.redirect(`/event/list`);
            }
            catch (error) {
                req.flash(`err`, `No se pudo crear el evento.`);
                return res.redirect(`/event/list`);
            }
        });
    }
    SetStateEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = req.query.status;
            if (!status) {
                req.flash(`err`, `Error temporal, intentelo más tarde`);
                return res.redirect(`/event`);
            }
            const id = req.params.id;
            yield EventModel_1.default.UpdateState({ id, status });
            req.flash(`succ`, `Evento actualizado a: ${status}`);
            return res.redirect(`/event/list`);
        });
    }
    AddCancelation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isCash, description, mount_total, mount_unity } = req.body;
            const id = req.params.id;
            const Save = {
                description, mount_unity,
                mount_total: Number(mount_total),
                eventId: id,
                isCash: isCash ? true : false
            };
            yield EventModel_1.default.CreateCancelation({ data: Save });
            req.flash(`succ`, `Cancelación creada.`);
            return res.redirect(`/event/list`);
        });
    }
    SetPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { percentage, date, mount, code, /*mount_unity, mount_total,description*/ } = req.body;
            const id = req.params.id;
            const data = {
                percentage, date, mount, code,
                cancelationsId: id
            };
            yield EventModel_1.default.AddCancelationTime({ data });
            req.flash(`succ`, `Creado exitosamente.`);
            return res.redirect(`/event/list`);
        });
    }
    UpdateAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { admin_observation, admin_code } = req.body;
            const id = req.params.id;
            yield EventModel_1.default.UpdateEvent({ data: { admin_observation, admin_code }, id });
            req.flash(`succ`, `Actualización exitosa`);
            return res.redirect(`/event/list`);
        });
    }
    LoadRouters() {
        this.router.get(`/event/`, auth_1.OnSession, this.DashboardController);
        this.router.get(`/event/statictics`, auth_1.OnSession, this.StaticticsController);
        this.router.get(`/event/list`, auth_1.OnSession, this.RenderList);
        this.router.post(`/event/list`, auth_1.OnSession, this.RenderList);
        this.router.get(`/event/create`, auth_1.OnSession, this.RenderCreate);
        this.router.get(`/event/:id/update`, auth_1.OnSession, this.RenderShow);
        this.router.get(`/event/:id/reprograming`, auth_1.OnSession, this.RenderReprogramming);
        this.router.post(`/event/:id/reprograming`, auth_1.OnSession, this.LogicReprogramming);
        this.router.post(`/event/:id/admin`, auth_1.OnSession, this.UpdateAdmin);
        this.router.post(`/event/:id/status`, auth_1.OnSession, this.SetStateEvent);
        this.router.post(`/event/create`, auth_1.OnSession, this.CreateEventPost);
        this.router.get(`/event/create/reserved`, this.RenderCreateReserved);
        this.router.post(`/event/create/reserved`, this.CreateEventPost);
        this.router.post(`/event/:id/create/cancelation`, auth_1.OnSession, this.AddCancelation);
        this.router.post(`/event/:id/set/payment`, auth_1.OnSession, this.SetPayment);
        ///event/{{data.eventId}}/set/payment
        return this.router;
    }
}
exports.default = new UserController();
