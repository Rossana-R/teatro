import dotenv from "dotenv";
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/BaseMyApp";
export const PORT = process.env.PORT || 8080;

/**

    {
    _id: ObjectId('6636898c0a777acbeff1f984'),
    rol: 'ADMIN',
    photo_id: 'profile.jpg',
    create_at: ISODate('2024-05-04T19:16:06.616Z'),
    update_at: ISODate('2024-05-05T00:49:13.083Z'),
    username: 'superadmin',
    email: 'superadmin@example.com',
    password: '$2b$11$ClQYIDMZmdhvMOj/rsvZfOTDsj4fbzVsx9eAKt7K4UEszer4Cfxte',
    __v: 0
  }

 */