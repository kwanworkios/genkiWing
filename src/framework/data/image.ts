import { Data } from './data';
export class Image extends Data {
    url: string;
    width: number = 0;
    height: number = 0;
    source: string;
}