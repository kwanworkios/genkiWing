import { Brand } from './brand';
import { Category } from './category';
import { Data } from './data';
import { Location } from './location';

export class Store extends Data {

    id: number;
    name: string;
    categories: Category[];
    location: Location;
    brand: Brand;
    brandId: number;
    features: string[];
    handle:string;
    currency: string;
    timezone: string;
    country: string;
    posId: number;
    groupId: number;
    languages: string[];
    storeListDistance:string;
    distance;
    remark;
    meta;

    protected toProperty(name: string, value) {

        switch (name) {
            case "brand":
                value = Data.toData(Brand, value);
                break;
            case "categories":
                value = Data.toDataArray(Category, value);
                break;
            case "location":
                value = Data.toData(Location, value);
                break;
            default:
                value = super.toProperty(name, value);
                break;
        }

        return value;
    }

}