import { Request, Response, Router } from "express";
import { OffSession, OnSession } from "../middleware/auth";
import { RegisterEvent } from "../controllers/public.controller";

const routes = Router();

routes.get(`/public/register/event`, (req, res) => {
    return res.render(`public/eventRegister`)
})

export default routes;
