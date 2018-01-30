import { Data } from "../framework/data/data";


export class User extends Data {
    memberId: string;
    sessionId: string;

    id: number;

    nickname: string;
    lastname: string;
    name: string;
    firstName: string;
    facebookId: string;
    email: string;
    gender: string;
    language: string;
    crm;
}