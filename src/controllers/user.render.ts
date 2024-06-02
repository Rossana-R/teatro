import { Request, Response } from "express";
import { GetUserByIdMdl, GetUsersCounts, GetUsersMld } from "../model/user.model";

// renders

export async function RenderUserDashboard(req: Request, res: Response) {

    const ToView = {
            ubication: `Panel de usuario`,
            userCount: await GetUsersCounts(),
    }

    return res.render(`user/dashboard.hbs`, ToView);
}

export async function RenderUserList(req: Request, res: Response) {

    const pag = Number(req.query.pag) ? Number(req.query.pag) : 0;
    const ToView = {
        ubication: `Lista de usuarios`,
        userCount: await GetUsersCounts(),
        users: await GetUsersMld({pag}),
        nextPath: `/users/list/?pag=${pag+1}`,
        previousPath: `/users/list/?pag=${pag-1}`,
        nowTotal: ``,
        requirePagination: false,
        nowPath: pag,
        nowPathOne: pag!=0 ? true : false,
        nowPathEnd: false,
    }

    ToView.nowTotal = `${ToView.users.length+(pag*10)} / ${ToView.userCount}`;
    ToView.nowPathEnd = (ToView.users.length-9)>0 ? true : false;
    console.log(ToView.users.length, ToView.nowPathEnd)
    
    ToView.requirePagination = ToView.userCount > 10 ? true : false;

    return res.render(`user/list.hbs`, ToView);
}

export async function RenderUserNew(req: Request, res: Response) {

    const ToView = {
        ubication: `Crear Usuario`,

    }

    return res.render(`user/create.hbs`, ToView);
}

export async function RenderUserUpdate(req: Request, res: Response) {
    const id = req.params.id;

    const userId = await GetUserByIdMdl({id});

    if(!userId) {
        req.flash(`err`, `Usuario no encontrado.`);
        return res.redirect(`/users/list`);
    } 

    const ToView = {
        ubication: `Actualizar usuario`,
        userData: userId 
    }

    return res.render(`user/update.hbs`, ToView);
}

export async function RenderUserUnique(req: Request, res: Response) {
    const id = req.params.id;
    const userId = await GetUserByIdMdl({id});

    if(!userId) {
        req.flash(`err`, `Usuario no encontrado.`);
        return res.redirect(`/users/list`);
    } 

    const ToView = {
        ubication: `Ver usuario`,
        userData: userId 
    }

    return res.render(`user/show.hbs`, ToView);
}
