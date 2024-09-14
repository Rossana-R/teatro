import flash from "connect-flash";
import express, { NextFunction, Request, Response } from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import methodOverride from "method-override";
import morgan from "morgan";
// import morganfrom 'morgan');
import passport from "passport";
import path from "path";
import helpersHandlebars from "./config/helpers/helpers";
import Auth from "./controllers/auth/AuthController";
import User from "./controllers/user/UserController";
import Event from "./controllers/event/EventController";
import Type from "./controllers/transaction/type/TypeControl";
import Category from "./controllers/transaction/category/CategoryController";
import Transaction from "./controllers/transaction/TransactionController";
import Public from "./controllers/PublicController";
import Report from "./controllers/report/ReporController";
import Turn from "./controllers/event/turn/TurnController";
import APIStattictics from "./controllers/API/Statictics";
import { PORT } from "./constant";
import "./config/passport";

// init
const app = express();
// require("./config/passport.ts");

// Set Template engine to handlebars
app.set("views", path.join(__dirname, "views"));
app.engine("hbs", exphbs({
  defaultLayout: "main.hbs",
  layoutsDir: path.join(app.get("views"), "layouts"),
  partialsDir: path.join(app.get("views"), "partials"),
  helpers: helpersHandlebars,
  extname: ".hbs"
}));
app.set("view engine", "hbs");

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session({
  secret: "base_app",
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Var
app.use((req: Request, res: Response, next: NextFunction) => {
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

app.use("/", Auth.LoadRouters());
app.use("/", User.LoadRouters());
app.use(`/`, Turn.LoadRouters());
app.use("/", Event.LoadRouters());
app.use("/", APIStattictics.LoadRoutes())
app.use(`/`, Public.LoadRoutes());
app.use(`/`, Report.LoadRouters());

app.use(`/`, Type.LoadRoutes());
app.use(`/`, Category.LoadRoutes());
app.use(`/`, Transaction.LoadRoutes());

app.use("/start/user", User.InsertUserBase);
app.use("/start/statictis", User.StartStaticticsForYear);


// Static Files
app.use(express.static(path.join(__dirname, "../public")));

// Init Express
app.listen(
  PORT,
  () => {
    console.log(`Server started on port ${PORT}`) // tslint:disable-line
  }
);

