import { Request, Response } from "express";
import UserModel from "../models/user/UserModel";

import { UserCompleted, UserCreate } from "../type/user.d";
import { Router } from "express";

class BaseController {    
    public adminTest: UserCompleted | null = null

    public router = Router();

    public async InsertUserBase(req: Request, res: Response) {
        try {
            const listResponse = [];
            const model = UserModel;
            const superadmin: UserCreate = {
                email: `admin@teatro.sb`,
                lastname: `Teatro`,
                name: `Simon`,
                password: await model.HashPassword({password:`super@123.`}),
                username: `adminteatro`,
                createBy: null,
            }
            
            const superadminResult = await model.CreateUser({data:superadmin});

            listResponse.push(`UserCreate: ${superadminResult.name} ${superadminResult.lastname}`);  
            
            return res.status(200).json({body:listResponse});
        } catch (error) {
            return res.status(500).json({ok:false});   
        }
    }

    public async StartStaticticsForYear(req: Request, res: Response) {
        const date = new Date();
        const year = date.getFullYear();

        const result = await UserModel.CreateStatictisForYear({ year });

        return res.json({ body:result });


    }
}

export default BaseController;
