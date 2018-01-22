import { Store } from './store';
import { Category } from './category';
import { Data } from './data';

export class Menu extends Data {
    
    id: string;
    name: string;
    categories: Category[];
    stores: Store[];
    create: Date;
    update: Date;
    currency: string;
    
    protected toProperty(name: string, value) {

        switch (name) {
            case "categories":
                value = Data.toDataArray(Category, value);
                break;
            case "stores":
                value = Data.toDataArray(Store, value);
                break;    
            case "create":
            case "update":
                value = new Date();
                break;    
            default:
                value = super.toProperty(name, value);
                break;
        }

        return value;
    }
}