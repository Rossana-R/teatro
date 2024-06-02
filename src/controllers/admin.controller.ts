import { Request, Response } from "express";
import { ComparePassword, CreateUserMdl, GetUserByEmailMdl, GetUserByIdMdl, GetUserByUsernameMdl, GetUsersCounts, GetUsersMld, UpdateUserDataMdl, UpdateUserDeleteMdl, UpdateUserPasswordMdl } from "../model/user.model";
import { DataUser, RegisterUser } from "../type/user.d";
import { ChangeTwoLength } from "../utils/utils";
import { CountsAll, CountsEventsBy, GetEvents, GetEventToDate } from "../model/EventModel";
// import { RequestExtended } from "../type/ex";

export async function RenderDashboard(req: Request, res: Response) {
    try {

        const users =  GetUsersCounts();
        const events = CountsAll();

        const date = new Date();
        const year = date.getFullYear();
        const testMonth = `${date.getMonth()+1}`;
        const month = ChangeTwoLength(testMonth);

        const EventToDay = GetEventToDate({date:`${year}-${month}-${ChangeTwoLength(`${date.getDate()+0}`)}`});
        const EventToMorrow = GetEventToDate({date:`${year}-${month}-${ChangeTwoLength(`${date.getDate()+1}`)}`});

        const CountEventList = [
            CountsEventsBy({by:{admin_status:`FINALIZADO`}}),
            CountsEventsBy({by:{admin_status:`CANCELADO`}}),
            CountsEventsBy({by:{admin_status:`RECIBIDO`}}),
            CountsEventsBy({by:{admin_status:`APROBADO`}})
        ]

        const eventDayForDay = [
            GetEventToDate({date:`${year}-${month}-${ChangeTwoLength(`${date.getDate()+2}`)}`}),
            GetEventToDate({date:`${year}-${month}-${ChangeTwoLength(`${date.getDate()+3}`)}`}),
            GetEventToDate({date:`${year}-${month}-${ChangeTwoLength(`${date.getDate()+4}`)}`}),
            GetEventToDate({date:`${year}-${month}-${ChangeTwoLength(`${date.getDate()+5}`)}`}),
            GetEventToDate({date:`${year}-${month}-${ChangeTwoLength(`${date.getDate()+6}`)}`}),
        ];

        const ToView = {
            ubication: `Panel de control`,
            userCount: await users,
            eventCount: await events,
            eventsDay: [
                await EventToDay,
                await EventToMorrow,
                await eventDayForDay[2],
                await eventDayForDay[3],
                await eventDayForDay[4],
                await eventDayForDay[5],
                await eventDayForDay[6],
            ]
        }

        return res.render(`admin/dashboard`, ToView);

    } catch (error) {
        console.log(error);
        req.flash(`err`, `Error temporal`);
        return res.redirect(`/dashboard`);
    }
}

// User Logic
export async function CreateUser(req: Request, res: Response) {
    const {username, email, password} = req.body;

    const findEmailPromise = GetUserByEmailMdl({email});
    const findUsernamePromise = GetUserByUsernameMdl({username});

    const findEmail = await findEmailPromise;
    if (findEmail) {
        req.flash("err", "El correo electrónico ya está en uso.");
        return res.redirect(`/user/new`);
    }

    const findUsername = await findUsernamePromise;
    if (findUsername) {
        req.flash("err", "El nombre de usuario ya está en uso.");
        return res.redirect(`/user/new`);
    }

    const data: RegisterUser = { username, email, password };
    await CreateUserMdl({ data });

    req.flash(`succ`, `Usuario registrado exitosamente.`);
    return res.redirect(`/users`);
}

export async function UpdateDataUser(req: Request, res: Response) {
    const {email, username} = req.body;
    const user = req.user as DataUser

    if(!req.user) {
        req.flash(`err`, `Debes iniciar sesión.`);
        return res.redirect(`/login`);
    }

    let validUserRequired = true;
    let validEmailRequired = true;

    if(email == user.email) validEmailRequired = false;
    if(username == user.username) validUserRequired = false;

    const findEmailPromise = GetUserByEmailMdl({email});
    const findUsernamePromise = GetUserByUsernameMdl({username});

    const findEmail = await findEmailPromise;
    if (validEmailRequired && findEmail) {
        req.flash("err", "El correo electrónico ya está en uso.");
        return res.redirect(`/profile`);
    }

    const findUsername = await findUsernamePromise;
    if (validUserRequired && findUsername) {
        req.flash("err", "El nombre de usuario ya está en uso.");
        return res.redirect(`/profile`);
    }

    const id = req.params.id;
    const sendToModel = {email, username};
    await UpdateUserDataMdl({id, data: sendToModel});

    req.flash("succ", "Usuario actualizado exitosamente.");
    return res.redirect(`/profile`);

}

export async function UpdatePasswordUser(req: Request, res: Response) {
    const {password, repeat, old, oldSave} = req.body;
    const id = req.params.id;

    const matchPassword = await ComparePassword({ password: old, passwordDb: oldSave });

    if (!matchPassword) {
        req.flash(`err`, `La contraseña actual no coincide.`);
        return res.redirect(`/profile`);
    }

    if (password !== repeat) {
        req.flash(`err`, `Las contraseñas no coinciden`);
        return res.redirect(`/profile`);
    }

    await UpdateUserPasswordMdl({id, password});
    req.flash(`succ`, `Usuario actulizado exitosamente`);
    return res.redirect(`/profile`);
}

export async function UpdateDeleteUser(req: Request, res: Response) {
    const id = req.params.id;

    await UpdateUserDeleteMdl({ id });
    req.flash(`succ`, `usuario eliminado exitosamente`);
    return res.redirect(`/users`);
}

// event Logic

