import { Data } from './data';

export class Location extends Data {
    id: number;
    name: string;
    line: string;
    hint: string;
    longitude: number;
    latitude: number;
}