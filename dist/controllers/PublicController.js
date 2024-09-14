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
const EventModel_1 = __importDefault(require("../models/event/EventModel"));
const BaseController_1 = __importDefault(require("./BaseController"));
class PublicController extends BaseController_1.default {
    constructor() {
        super();
    }
    MyEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const event = yield EventModel_1.default.FindEventById({ id });
            if (!event || (event === null || event === void 0 ? void 0 : event.admin_status) === `RECIBIDO`)
                return res.render(`p/404.hbs`);
            const Params = {
                data: event,
                isEvent: true
            };
            if (!event) {
                Params.isEvent = false;
            }
            return res.render(`p/myevent.hbs`, Params);
        });
    }
    PublicScreen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // public
            return res.render(`p/public.hbs`);
        });
    }
    ReservedScreen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let create = req.query.create ? true : false;
            const date = req.query.date;
            let event = yield EventModel_1.default.FindEventToDate({ date });
            if (date === undefined) {
                event = null;
            }
            // public
            return res.render(`p/reserved.hbs`, { create, event, date });
        });
    }
    SearchScreen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // public
            return res.render(`p/search.hbs`);
        });
    }
    RecervedDay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.render(`p/reserved.hbs`);
        });
    }
    LoadRoutes() {
        this.router.get(`/public/event/:id`, this.MyEvent);
        this.router.get(`/`, this.PublicScreen);
        this.router.get(`/reserved`, this.ReservedScreen);
        this.router.get(`/search`, this.SearchScreen);
        return this.router;
    }
}
exports.default = new PublicController();
