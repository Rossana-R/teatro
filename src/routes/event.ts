import { Request, Response, Router } from "express";
import { CreateUser, GetUserById, GetUsers, UpdateDataUser, UpdateDeleteUser, UpdatePasswordUser } from "../controllers/admin.controller";
import { OffSession, OnSession } from "../middleware/auth";
import { CreateUserMdl, GetUserByIdMdl, GetUsersMld } from "../model/user.model";
import { GetEventById, GetEventCounts, GetEvents } from "../model/event.model";
// import userSchema from "../model/schemas/userSchema";"
import { EventAporteRender, EventByIdRender, EventDataAdminRender, EventsRender, UpdateAdminEvent, UpdateAdminPaymentEvent, UpdateDataEvent, UpdateEvent, UpdateMethodAporteEvent, UpdateMoreAporteEvent, UpdateStatusEvent } from "../controllers/EventController";

const routes = Router();

// render
routes.get("/events", OnSession, EventsRender);

routes.get(`/event/:id`, OnSession, EventByIdRender)

routes.get(`/event/:id/aporte`, OnSession, EventAporteRender);

routes.get(`/event/:id/admin`, OnSession, EventDataAdminRender)

routes.get(`/event/:id/update`, OnSession, UpdateEvent)

routes.get(`/event/:id/status`, OnSession, UpdateStatusEvent);

routes.post(`/event/:id/update`, OnSession, UpdateDataEvent);

routes.post(`/event/update/admin/:id`, OnSession, UpdateAdminEvent);

routes.post(`/event/update/payment/:id`, OnSession, UpdateAdminPaymentEvent);

// routes.post(`/event/update/payment/:id`, OnSession, UpdateAdminPaymentEvent);

routes.post(`/event/update/aporte/:id`, OnSession, UpdateMethodAporteEvent);
routes.post(`/event/update/aporte/:id/avances`, OnSession, UpdateMoreAporteEvent);



export default routes;
