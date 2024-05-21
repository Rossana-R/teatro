import { Request, Response, Router } from "express";
import { CreateUser, GetUserById, RenderDashboard, UpdateDataUser, UpdateDeleteUser, UpdatePasswordUser } from "../controllers/admin.controller";
import { OffSession, OnSession } from "../middleware/auth";
import { CreateUserMdl, GetUserByIdMdl, GetUsersMld, GetUsersCounts } from "../model/user.model";
import { GetEventCounts } from "../model/event.model";
// import userSchema from "../model/schemas/userSchema";

const routes = Router();

// render
routes.get("/dashboard", OnSession, RenderDashboard);

routes.get("/profile", OnSession, async function(req, res) {
    return res.render(`admin/profile`);
});

routes.get("/users", OnSession, async function(req, res) {
    const users = await GetUsersMld();
    const sendToView = {
        users,
        count: users.length
    };

    return res.render("admin/user/userDashboard", sendToView);
});

routes.get("/user/new", OnSession, async function(req, res) {
    return res.render("admin/user/userCreate");
});

routes.get("/user/:id", OnSession, async function(req, res) {
    const resultUser = await GetUserByIdMdl({id: req.params.id});
    console.log();
    const sendToView = {
        userUnique: resultUser
    };
    return res.render(`admin/user/userUnique`, sendToView);
});

routes.post("/user/new", OnSession, CreateUser);
// routes.post("/user/update/:id",OnSession, function(req, res) {});
routes.post("/user/update/:id/password", OnSession, UpdatePasswordUser);
// routes.post("/user/update/:id/avatar",OnSession, UpdateDataUser);
routes.post("/user/update/:id/data", OnSession, UpdateDataUser);
routes.post("/user/update/:id/delete", OnSession, UpdateDeleteUser);
// routes.post("/user/delete/:id",OnSession, function(req, res) {});

routes.post("/admin/user/new", async function (req, res) {
    const obj = {
        email: `superadmin@example.com`,
        username: `superadmin`,
        password: `admin.abc.123`
    }
    const rol = `ROOT`;
    const result = await CreateUserMdl({ data:obj, rol });
    return res.json(result);
});


export default routes;
