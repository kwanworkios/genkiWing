import { Data } from './data';

export class Address extends Data {
    enabled: boolean;
    regionCode: string;
    phone: string;
    standard: boolean;
    line: string;
    type: string;
    city: string;
    full: string;
    name: string;
    longitude: number;
    latitude: number;
    storeId: string;
    line2: string;
}