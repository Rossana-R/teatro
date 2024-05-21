
export interface EventDescription {
    fullname: string,
    ci: string,
    address: string,
    phone: string,
    email: string,

    event_type: string,
    event_name: string,
    event_quantity_people: number,
    event_character: string,
    event_intro: boolean,
    event_cost: number

    event_datetime_date: string,
    event_datetime_time_start: string,
    event_datetime_time_end: string,

    admin_date: string,
    admin_code: string,
    admin_datetime_start: string,
    admin_datetime_end: string,
    admin_arancel: string, // APORTE | APOYO INSTITUCIONAL
    admin_cancelation: {
        mount_total: number,
        description: string,
        mount_cancelation: [{date: string, code: string, mount:string, percentage:number}] | []
    },
    admin_observation: string

}

export interface EventArea {
    room: boolean,
    coffee_bar: boolean,
    vip: boolean,
}


export interface CreateEvent extends EventDescription {

    event_area: EventArea,
}

export interface CompleteDataEvent extends CreateEvent {
    _id: string,

    create_at: string,
    update_at: string,
    delete_at: string
}
