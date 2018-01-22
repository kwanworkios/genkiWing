import { Data } from './data';

export class Brand extends Data {
    id: number;
    name: string;
    features: string[];
    colors:{};
    groupId: number;    
    handle: string;
    theme: string;
}