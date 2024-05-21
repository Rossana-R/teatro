
import mongoose, { Schema } from "mongoose";

const User = new Schema({
    email: String,
    username: String,
    password: String,
    token: String,
    token_description: String,
    rol: {
        type: String,
        default: "ADMIN"
    },
    photo_id: {
        type: String,
        default:  "profile.jpg"
    },
    create_at: {
        type: Schema.Types.Date,
        default: Date.now()
    },
    update_at: {
        type: Schema.Types.Date,
        default: Date.now()
    },
    delete_at: Schema.Types.Date,
});

export default mongoose.model("User", User);
