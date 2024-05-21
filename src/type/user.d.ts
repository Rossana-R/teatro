
export interface LoginUser {
    email: string,
    password: string
}

export interface RegisterUser extends LoginUser {
    username: string
}

export interface DataUser extends RegisterUser {
    _id: string,
    photo_id: string
}
