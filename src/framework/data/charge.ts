import { Data } from './data';

export class Charge extends Data {
    id: string;
    amount: number;
    type: string;
    create: number;
    currency: string;
    email: string;
    phone: string;
    payeeId: number;
    subtype: string;
    method: string;
    
}