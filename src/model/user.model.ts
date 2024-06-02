
import bcrypt from "bcrypt";
import userSchema from "./schemas/user.schema";

import { RegisterUser } from "../type/user.d";
import passport from "passport";

// db.users.update({"email":"admin001@example.com"}, {$unset:{"delete_at":""}})

export const GetUsersCounts = async () => {
    const result = await userSchema.count({});
    return result;
}

export const GetUsersMld = async ({pag}:{pag:number}) => {
    const result = await userSchema.find({

        $and: [
            {
                rol: { $ne:`ROOT` }
            },
            {
                $or: [
                    {delete_at: undefined},
                    {delete_at: null},
                    {delete_at: ``},
                ]
            }
        ]
    }).skip(pag*10).limit(10);
    return result;
};
export const GetUserByIdMdl = async ({id}: {id: string}) => {
    const result = await userSchema.findById(id);
    return result;
};
export const GetUserByEmailMdl = async ({email}: {email: string}) => {
    const result = await userSchema.findOne({email});
    return result;
};
export const GetUserByUsernameMdl = async ({username}: {username: string}) => {
    const result = await userSchema.findOne({username});
    return result;
};

export const EncrypPassword = async ({password}: {password: string}) => {
    return await bcrypt.hash(password, 11);
};

export const ComparePassword = async ({password, passwordDb}: {password: string, passwordDb: string}) => {
    return await bcrypt.compare(password, passwordDb);
};

export const CreateUserMdl = async ({rol=`ADMIN`,data}: {rol?:string,data: RegisterUser}) => {
    data.password = await bcrypt.hash(data.password, 11);
    const create = new userSchema({email:data.email, username:data.username, password:data.password, rol});
    const result = create.save();
    console.log(result);
    return result;
};

export const UpdateUserDeleteMdl = async ({id}: {id: string}) => {
    const result = await userSchema.updateOne({_id: id}, { $set: {delete_at: Date.now() } });
    return result;
};

export const UpdateUserDataMdl = async ({id, data}: {id: string, data: {email: string, username: string}}) => {
    const result = await userSchema.findByIdAndUpdate(id, { $set: {email: data.email, username: data.username, update_at: Date.now() } });
    return result;
};

export const UpdateUserPasswordMdl = async ({id, password}: {id: string, password: string}) => {
    const passwordHash = await EncrypPassword({password});
    const result = await userSchema.findByIdAndUpdate(id, { $set: {password: passwordHash, update_at: Date.now() } });
    return result;
};

export const UpdateUserAvatarMdl = async ({id, avatar}: {id: string, avatar: string}) => {
    const result = await userSchema.findByIdAndUpdate(id, { $set: {photo_id: avatar, update_at: Date.now() } });
    return result;
};

// export const UpdateDataById = async ({id, data}:{id:string, data:Regis})
