"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_flash_1 = __importDefault(require("connect-flash"));
const express_1 = __importDefault(require("express"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const express_session_1 = __importDefault(require("express-session"));
const method_override_1 = __importDefault(require("method-override"));
const morgan_1 = __importDefault(require("morgan"));
// import morganfrom 'morgan');
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const helpers_1 = __importDefault(require("./config/helpers/helpers"));
const AuthController_1 = __importDefault(require("./controllers/auth/AuthController"));
const UserController_1 = __importDefault(require("./controllers/user/UserController"));
const EventController_1 = __importDefault(require("./controllers/event/EventController"));
const TypeControl_1 = __importDefault(require("./controllers/transaction/type/TypeControl"));
const CategoryController_1 = __importDefault(require("./controllers/transaction/category/CategoryController"));
const TransactionController_1 = __importDefault(require("./controllers/transaction/TransactionController"));
const PublicController_1 = __importDefault(require("./controllers/PublicController"));
const ReporController_1 = __importDefault(require("./controllers/report/ReporController"));
const TurnController_1 = __importDefault(require("./controllers/event/turn/TurnController"));
const Statictics_1 = __importDefault(require("./controllers/API/Statictics"));
const constant_1 = require("./constant");
require("./config/passport");
// init
const app = (0, express_1.default)();
// require("./config/passport.ts");
// Set Template engine to handlebars
app.set("views", path_1.default.join(__dirname, "views"));
app.engine("hbs", (0, express_handlebars_1.default)({
    defaultLayout: "main.hbs",
    layoutsDir: path_1.default.join(app.get("views"), "layouts"),
    partialsDir: path_1.default.join(app.get("views"), "partials"),
    helpers: helpers_1.default,
    extname: ".hbs"
}));
app.set("view engine", "hbs");
// Middleware
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, method_override_1.default)("_method"));
app.use((0, express_session_1.default)({
    secret: "base_app",
    resave: true,
    saveUninitialized: true
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, connect_flash_1.default)());
// Global Var
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.succ = req.flash("succ");
    res.locals.err = req.flash("err");
    res.locals.error = req.flash("error");
    next();
});
// Route Auth
// app.get(`/`, (req, res) => {
//   if(req.user) return res.redirect(`/dashboard`);
//   res.redirect(`/login`)
// })
app.use("/", AuthController_1.default.LoadRouters());
app.use("/", UserController_1.default.LoadRouters());
app.use(`/`, TurnController_1.default.LoadRouters());
app.use("/", EventController_1.default.LoadRouters());
app.use("/", Statictics_1.default.LoadRoutes());
app.use(`/`, PublicController_1.default.LoadRoutes());
app.use(`/`, ReporController_1.default.LoadRouters());
app.use(`/`, TypeControl_1.default.LoadRoutes());
app.use(`/`, CategoryController_1.default.LoadRoutes());
app.use(`/`, TransactionController_1.default.LoadRoutes());
app.use("/start/user", UserController_1.default.InsertUserBase);
app.use("/start/statictis", UserController_1.default.StartStaticticsForYear);
// Static Files
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// Init Express
app.listen(constant_1.PORT, () => {
    console.log(`Server started on port ${constant_1.PORT}`); // tslint:disable-line
});
