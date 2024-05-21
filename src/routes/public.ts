import { Request, Response, Router } from "express";
import { OffSession, OnSession } from "../middleware/auth";
import { RegisterEvent } from "../controllers/public.controller";
import { GetEventByCode } from "../model/event.model";

const routes = Router();

routes.get(`/public/register/event`, (req, res) => {
    return res.render(`public/eventRegister`)
})

routes.get(`/public/event/:code`, async (req, res) => {
    const evt = await GetEventByCode({code:req.params.code});
    console.log(evt);
    return res.render(`admin/event/publicCode`, {evt})
})

routes.post(`/public/register/event`, RegisterEvent)

export default routes;
