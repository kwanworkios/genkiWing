import { Data } from "../framework/data/data";

export class Ticket extends Data {
    update: number;
    phone: string;
    queueId: string;
    status: string;
    station: string;
    number: string;
    brandId: number;
    create: number;
    //callDate;
    //reference;
    //version;
    id: string;
    vip: boolean;
    //completeDate;
    seat;
    // seq;
    memberId: number;
    // uuid;
    storeId: number;
    callCount:number
}