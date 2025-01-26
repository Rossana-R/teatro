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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const UserModel_1 = __importDefault(require("../models/user/UserModel"));
passport_1.default.use("local.login", new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password"
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModel_1.default.FindUserByEmail({ email });
    if (user) {
        const dbPassword = user.password;
        const match = yield UserModel_1.default.ComparePassword({ password, dbPassword: dbPassword });
        if (match) {
            return done(null, user);
        }
        else {
            return done(null, false, { message: "Verifica tus credenciales." });
        }
    }
    else {
        return done(null, false, { message: "Verifica tus credenciales." });
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.userId);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModel_1.default.FindUserById({ id });
    if (!user)
        return done(`404`, null);
    return done(null, user);
}));
