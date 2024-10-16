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
class EventModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    // get users pagination
    GetEvents(_a) {
        return __awaiter(this, arguments, void 0, function* ({ pag, limit = 10, filter }) {
            try {
                this.StartPrisma();
                const result = yield this.prisma.event.findMany({
                    where: filter ? filter : {},
                    skip: pag * 10,
                    take: limit,
                    include: {
                        cancelationRef: {
                            include: {
                                eventRef: true
                            }
                        }
                    }
                });
                this.DistroyPrisma();
                return result;
            }
            catch (error) {
                console.log(error);
                return [];
            }
        });
    }
    CountBy(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter }) {
            const result = yield this.prisma.event.count({ where: filter });
            return result;
        });
    }
    // crea evento
    CreateEvent(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = yield this.prisma.event.create({
                data: Object.assign(Object.assign({}, data), { admin_code: `0000-0000-0000-00` }),
            });
            this.DistroyPrisma();
            const month = result.event_datetime_date.split(`-`)[1];
            yield this.StaticticsUpdate({ currentMonth: Number(month) });
            return result;
        });
    }
    FindEventToDate(_a) {
        return __awaiter(this, arguments, void 0, function* ({ date }) {
            this.StartPrisma();
            const result = yield this.prisma.event.findFirst({ where: { event_datetime_date: date } });
            this.DistroyPrisma();
            return result;
        });
    }
    CountEventStatusAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.StartPrisma();
            const resultPromise = [
                this.prisma.event.count(),
                this.prisma.event.count({ where: { admin_status: `RECIBIDO` } }),
                this.prisma.event.count({ where: { admin_status: `APROBADO` } }),
                this.prisma.event.count({ where: { admin_status: `CANCELADO` } }),
                this.prisma.event.count({ where: { admin_status: `FINALIZADO` } }),
            ];
            const all = yield resultPromise[0];
            const recibido = yield resultPromise[1];
            const aprovado = yield resultPromise[2];
            const cancelado = yield resultPromise[3];
            const finalizado = yield resultPromise[4];
            return { all, aprovado, cancelado, finalizado, recibido };
        });
    }
    // busca usuario por id
    FindEventById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            this.StartPrisma();
            const result = yield this.prisma.event.findFirst({
                where: { eventId: id },
                include: {
                    cancelationRef: {
                        include: {
                            cancelationRef: true
                        }
                    }
                }
            });
            this.DistroyPrisma();
            return result;
        });
    }
    UpdateState(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, status }) {
            this.StartPrisma();
            const result = yield this.prisma.event.update({ data: { admin_status: status }, where: { eventId: id } });
            this.DistroyPrisma();
            return result;
        });
    }
    CreateCancelation(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = this.prisma.cancelations.create({ data });
            this.DistroyPrisma();
            return result;
        });
    }
    AddCancelationTime(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data }) {
            this.StartPrisma();
            const result = yield this.prisma.cancelationRef.create({ data });
            this.DistroyPrisma();
            return result;
        });
    }
    UpdateEvent(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, id }) {
            this.StartPrisma();
            const result = this.prisma.event.update({
                data,
                where: { eventId: id }
            });
            this.DistroyPrisma();
            return yield result;
        });
    }
    UpdateDate(_a) {
        return __awaiter(this, arguments, void 0, function* ({ date, id }) {
            this.StartPrisma();
            const result = this.prisma.event.update({
                data: {
                    admin_date: date.date_start[0],
                    admin_datetime_end: date.date_end[0],
                    admin_datetime_start: date.date_start[0],
                    event_datetime_date: date.date_start[0],
                    event_datetime_tiem_end: date.date_end[1],
                    event_datetime_tiem_start: date.date_start[1],
                },
                where: { eventId: id }
            });
            this.DistroyPrisma();
            return yield result;
        });
    }
    ReportEvent(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter, skip, take }) {
            this.StartPrisma();
            const result = yield this.prisma.event.findMany({
                where: filter,
                skip,
                take
            });
            const count = yield this.prisma.event.count({
                where: filter
            });
            this.DistroyPrisma();
            return { result, count };
        });
    }
}
exports.default = new EventModel();
