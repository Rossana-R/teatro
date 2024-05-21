import mongoose, { Schema, Types } from 'mongoose';

const Event = new Schema({
    fullname: String,
    ci: String,
    address: String,
    phone: String,
    email: String,
    
    event_type: String,
    event_name: String,
    event_quantity_people: Number,
    event_character: String,
    event_intro: Boolean,
    event_cost: Number,
    
    event_area: {
        room: Boolean,
        coffee_bar: Boolean,
        vip: Boolean,
    },

    event_datetime_date: String,
    event_datetime_tiem_start: String,
    event_datetime_tiem_end: String,

    admin_date: String,
    admin_status: {
        type: String,
        default: `RECIBIDO`
    },
    admin_code: String,
    admin_datetime_start: String,
    admin_datetime_end: String,
    admin_arancel: String, // APORTE | APOYO INSTITUCIONAL
    
    admin_cancelation: {
        mount_total: Number,
        description: String,
        mount_cancelation: [{date: String, code: String, mount:String, percentage:Number}]
    },
    admin_observation: {
        type: String,
        default: ``
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

export default mongoose.model('Event', Event);
