import { Data } from './data';

export class Field extends Data {
    id: number;
    name: string;
    value: any;
    type: string;
    ptype: string;
    input: string;
    sort: string;
    title: string;
    example: string;
    readonly: boolean = false;
    desc: string;
    locale: string;
    content: any;
    required: boolean = false;
    validation: string;
}