import { Request, Response, Router } from "express";
import { OffSession, OnSession } from "../middleware/auth";

const routes = Router();

routes.get("/", OffSession, function(req, res) {
    return res.render(`login`);
});

routes.get("/login", OffSession, function(req, res) {
    return res.render(`login`);
});

export default routes;
