import { Request, Response, Router } from "express";
import { CreateUser, RenderDashboard,  UpdateDataUser, UpdateDeleteUser, UpdatePasswordUser } from "../controllers/admin.controller";
import { RenderUserDashboard, RenderUserList, RenderUserNew, RenderUserUnique, RenderUserUpdate } from "../controllers/user.render";
import { OnSession } from "../middleware/auth";
import { CreateUserMdl } from "../model/user.model";
import { CreateEvent } from "../controllers/EventController";
// import userSchema from "../model/schemas/userSchema";

const routes = Router();

// render
routes.get("/dashboard", OnSession, RenderDashboard);

routes.get("/profile", OnSession, async function(req, res) {
    return res.render(`admin/profile`);
});

// users
routes.get("/users", OnSession, RenderUserDashboard);
routes.get("/users/list", OnSession, RenderUserList);
routes.get("/users/new", OnSession, RenderUserNew);
routes.get("/users/update/:id", OnSession, RenderUserUpdate);
routes.get("/users/:id", OnSession, RenderUserUnique);

routes.post("/user/new", OnSession, CreateUser);
routes.post("/user/update/:id/password", OnSession, UpdatePasswordUser);
routes.post("/user/update/:id/data", OnSession, UpdateDataUser);
routes.post("/user/update/:id/delete", OnSession, UpdateDeleteUser);

routes.get("/start/app", async function (req, res) {
    return res.status(400);
    const obj = {
        email: `superadmin@teatro.sb`,
        username: `superadmin`,
        password: `admin.abc.123`
    }
    const obj1 = {
        email: `admin01@teatro.sb`,
        username: `admin01`,
        password: `admin.abc.123`
    }
    const obj2 = {
        email: `admin02@teatro.sb`,
        username: `admin02`,
        password: `admin.abc.123`
    }
    const rol = `ROOT`;
    const result1 = await CreateUserMdl({ data:obj, rol });
    const result2 = await CreateUserMdl({ data:obj1, rol:`ADMIN` });
    const result3 = await CreateUserMdl({ data:obj2, rol:`ADMIN` });
    return res.json({body:[result1,result2,result3]});
});

// event
routes.post(`/events/new`, OnSession, CreateEvent)

export default routes;
