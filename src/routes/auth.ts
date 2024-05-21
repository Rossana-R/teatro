import { Request, Response, Router } from "express";
import passport from "passport";

const routes = Router();

routes.get(`/login`, (req, res) => {

    return res.render(`login`);
});

routes.post("/login", function(req, res, next) {
    console.log(req.body);
    passport.authenticate("local.login", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
});

routes.get(`/logout`, async function(req, res) {
    if (req.session) {
        req.session.destroy(() => {});
        return res.redirect(`/login`);
    }
    return res.redirect(`/login`);
});

export default routes;
