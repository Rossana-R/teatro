import flash from "connect-flash";
import express, {
  Application,
  json,
  urlencoded
} from "express";
import initMongoDB from "./config/mongodb";
import exphbs from "express-handlebars";
import session from "express-session";
import methodOverride from "method-override";
import morgan from "morgan";
// import morganfrom 'morgan');
import passport from "passport";
import path from "path";
import helpersHandlebars from "./config/helpers/helpers";
import RouteAdmin from "./routes/admin";
import RouteAuth from "./routes/auth";
import RouteDefault from "./routes/default";
import RoutePublic from "./routes/public";
import RouteEvent from "./routes/event";
import { PORT } from "./constant";
import "./config/passport";

// init
const app: Application = express();
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
app.use(json());
app.use(urlencoded({ extended: true }));
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
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.succ = req.flash("succ");
    res.locals.err = req.flash("err");
    res.locals.error = req.flash("error");
    next();
});

// Route Auth
app.use("/", RouteAuth);
app.use("/", RouteDefault);
app.use("/", RouteAdmin);
app.use("/", RoutePublic);
app.use("/", RouteEvent);

// Static Files
app.use(express.static(path.join(__dirname, "../public")));

// Init Express
app.listen(
  PORT,
  () => {
    initMongoDB();
    console.log(`Server started on port ${PORT}`) // tslint:disable-line
  }
);

