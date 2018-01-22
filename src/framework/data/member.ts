import { Data } from './data';

export class Member extends Data {
    id: number;
    sessionId: string;
    email: string;
    avatarUrl: string;
    language: string;
    name: string;
    gender: string;
    firstName: string;
    lastName: string;
    groupId: number;
    brandId: number;
    storeId: number;
    admin: boolean = false;
    phone: string;
}