import { Ad } from './ad';
import { Data } from "../framework/data/data";
import { Store } from "../framework/data/store";
import { Link } from '../framework/data/link';

export class Brand extends Data {
    id: number;
    name: string;
    stores: Store[];
    ads: Ad[];
    link: Link;

    protected toProperty(name: string, value: any) {
        switch (name) {
            case 'stores':
                value = Data.toDataArray(Store, value);
                break;
            case value:
                value = Data.toDataArray(Ad, value);
                break;
            case value:
                value = Data.toData(Link, value);
                break;
            default:
                value = super.toProperty(name, value);
                break;
        }
        return value;
    }
}