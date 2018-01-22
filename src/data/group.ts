import { Data } from './../framework/data/data';
import { Brand } from './brand';


export class Group extends Data {
    id: number;
    brands: Brand[];
    protected toProperty(name: string, value) {
        switch (name) {
            case "brand":
                value = Data.toDataArray(Brand, value);
                break;
            default:
                value = super.toProperty(name, value);
                break;
        }
        return value;
    }
}