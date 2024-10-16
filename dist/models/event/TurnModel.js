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
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.StartPrisma();
            const result = yield this.prisma.turn.create({ data });
            this.DistroyPrisma();
            return result;
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            this.StartPrisma();
            const result = yield this.prisma.turn.count();
            this.DistroyPrisma();
            return result;
        });
    }
    findAll(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit, pag, filter }) {
            this.StartPrisma();
            const result = this.prisma.turn.findMany({ take: pag * 10, skip: limit, });
            this.DistroyPrisma();
            return result;
        });
    }
    findById() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = new EventModel();
