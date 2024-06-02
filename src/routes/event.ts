import { Router } from "express";
import { OnSession } from "../middleware/auth";
import { 
    RenderEventDashboard,
    RenderEventList, 
    RenderEventUnique, 
    RenderEventNew, 
    RenderEventUpdate
} from "../controllers/event.render";
import { UpdateEvent, UpdateStatusEvent, UpdateAdminEvent, UpdateSetPaymentEvent, UpdateSetPaymentAvanceEvent } from "../controllers/EventController";

const routes = Router();

// render
routes.get("/events", OnSession, RenderEventDashboard);

routes.get("/events/list", OnSession, RenderEventList);

routes.get(`/event/:id/show`, OnSession, RenderEventUnique);

routes.get(`/events/new`, OnSession, RenderEventNew);

routes.get(`/events/update/:id`, OnSession,RenderEventUpdate);


// routes.get(`/event/:id/status`, OnSession);

routes.post(`/event/:id/update`, OnSession, UpdateEvent);

routes.post(`/event/:id/status`, OnSession, UpdateStatusEvent);
routes.post(`/event/:id/admin`, OnSession, UpdateAdminEvent);
routes.post(`/event/:id/setpayment`, OnSession, UpdateSetPaymentEvent);
routes.post(`/event/:id/set/payment`, OnSession, UpdateSetPaymentAvanceEvent);

// routes.post(`/event/update/payment/:id`, OnSession);

// // routes.post(`/event/update/payment/:id`, OnSession);

// routes.post(`/event/update/aporte/:id`, OnSession);
// routes.post(`/event/update/aporte/:id/avances`, OnSession);



export default routes;
