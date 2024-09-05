import { Request, Response } from "express";
import BaseController from "../BaseController";
import UserModel from "../../models/user/UserModel";
import TransactionInstance from "../../models/transacction/TransactionModel";
import { UserCompleted, UserCreate } from "../../type/user";
import { OnSession } from "../../middleware/auth";
import EventModel from "../../models/event/EventModel";

const TransactionModel = new TransactionInstance();

class UserController extends BaseController {

    public async DashboardController (req: Request, res: Response) {
        const transactionsCountPromise = TransactionModel.CountAllTransactions({});
        const counts = await EventModel.CountEventStatusAll();

        const transsactions = await transactionsCountPromise;

        return res.render(`s/dashboard.hbs`, {
            transactionCount: transsactions,
            ubication: `Resumen`,
            eventsStatus: counts
        });
    }

    public async StaticticsController (req: Request, res: Response) {

        return res.render(`s/statictics.hbs`, {
            ubication: `Resumen`,
        });
    }

    // render dashboard
    public async RenderDashboard(req: Request, res: Response) {

        const countPromise = UserModel.CountBy({ filter:{} });

        const Params = {
            count: await countPromise
        }

        return res.render(`s/user/dashboard.hbs`, Params);        
    }

    // render list
    public async RenderList(req: Request, res: Response) {
        const pag = req.params.pag | 0;
        const limit = req.params.limit | 10; 

        const users = UserModel.GetUsers({pag, limit});
        const countPromise = UserModel.CountBy({ filter:{} });

        const Params = {
            list: await users,
            next: `/users/list?pag=${pag+1}`,
            previous: pag == 0 ? null : `/users/list?pag=${pag-1}`,
            count: await countPromise,

            nowTotal: ``,
            requirePagination: false,
            nowPath: pag,
            nowPathOne: pag!=0 ? true : false,
            nowPathEnd: false,
        }

        Params.nowTotal = `${Params.list.length+(pag*10)} / ${Params.count}`;
        Params.nowPathEnd = (Params.list.length-9)>0 ? true : false;
        
        Params.requirePagination = Params.count > 10 ? true : false;

        return res.render(`s/user/list.hbs`, Params);     
    }

    // render create
    public async RenderCreate(req: Request, res: Response) {
        const Params = {}

        return res.render(`s/user/create.hbs`, Params);  
    }

    // render show and update
    public async RenderShow(req: Request, res: Response) {
        const id = req.params.id;
        const user = await UserModel.FindUserById({id});

        if(null == user) {
            req.flash(`err`, `Usuario no encontrado.`);
            return res.redirect(`/users/list`);
        }

        const Params = {data:user};
        return res.render(`s/user/show.hbs`, Params);  
    }

    // render profile
    public async RenderProfile(req: Request, res: Response) {
        const user = req.user;
        console.log(user);

        return res.render(`s/profile.hbs`)
    }

    // logic register
    public async CreateUserPost(req: Request, res: Response) {
        try {
            const user = req.user as UserCompleted;
            const NewUser: UserCreate = {
                createBy: user.userId,
                email: req.body.email,
                lastname: req.body.lastname,
                name: req.body.name,
                password: await UserModel.HashPassword({ password: req.body.password }),
                username: req.body.username
            } 
            
            await UserModel.CreateUser({ data: NewUser });
            req.flash(`succ`, `Usuario creado.`);
            return res.redirect(`/user/list`);

        } catch (error) {
            console.log(error);
            req.flash(`err`, `No se pudo crear el usuario.`);
            return res.redirect(`/user/list`);
        }
    }

    public async logout(req: Request, res: Response) {
        req.logOut((err) => {
            return res.redirect(`/`)
        })
    }

    public async updateData(req: Request, res: Response) {
        const user = req.user as any; 
        await UserModel.UpdateById({data:req.body, id:user.userId});
        req.flash(`succ`, `Datos actualizados`);
        return res.redirect(`/profile`);
    }

    public async updatePassword(req: Request, res: Response) {
        const {newp, old, repeat} = req.body;
        const user = req.user as any;

        const compareOld = UserModel.ComparePassword({ dbPassword:user.password, password:old });
        if(!compareOld) {
            req.flash(`err`,`Verifique las contraseña`);
            return res.redirect(`/profile`);
        }

        if(newp !== repeat) {
            req.flash(`err`,`Verifique las contraseña`);
            return res.redirect(`/profile`);
        }

        const password = await UserModel.HashPassword({ password:newp }); 

        await UserModel.UpdatePassword({ password, id:user.userId });

        req.flash(`succ`,`Contraseña actualizada`);
        return res.redirect(`/profile`)

    }

    public LoadRouters() {
        this.router.get(`/logout`, OnSession, this.logout);
        this.router.get(`/dashboard`, OnSession, this.DashboardController);
        this.router.get(`/profile`, OnSession, this.RenderProfile);
        this.router.post(`/profile/update/data`, OnSession, this.updateData);
        this.router.post(`/profile/update/password`, OnSession, this.updatePassword);
        this.router.get(`/statictics`, OnSession, this.StaticticsController);
        this.router.get(`/user`, OnSession, this.RenderDashboard);
        this.router.get(`/user/list`, OnSession, this.RenderList);
        this.router.get(`/user/create`, OnSession, this.RenderCreate);
        this.router.get(`/user/:id/update`, OnSession, this.RenderShow);
        this.router.post(`/user/create`, OnSession, this.CreateUserPost);

        return this.router;
    }
}

export default new UserController();
