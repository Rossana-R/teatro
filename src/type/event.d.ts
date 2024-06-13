
export interface EventCreate {
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
    event_cost: number,

    event_datetime_date: string,
    event_datetime_tiem_start: string,
    event_datetime_tiem_end: string,

    admin_date: string,
    admin_status: string,
    admin_code: string,
    admin_datetime_start: string,
    admin_datetime_end: string,

    coffe_bar: boolean,
    room: boolean,
    vip: boolean,
}

export interface CancelationCreate {
    mount_unity:string,
    mount_total: number
    description:string,
    isCash: boolean,
    eventId: string
}

export interface RefReference {
    date: string,
    code: string,
    mount: string,
    percentage: string,
    cancelationsId: string
}

export interface SendToCreate {
    event: EventCreate,
    cancelation: CancelationCreate    
}

export interface CompletedEvent {}
