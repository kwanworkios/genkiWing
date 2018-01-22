import { ItemGroup } from './item-group';
import { Data } from './data';

export class Item extends Data {
    id: string;
    name: string;
    price: number;
    published: boolean;    

    groups: ItemGroup[] = [];

    protected toProperty(name: string, value) {

        switch (name) {

            case "groups":
                value = Data.toDataArray(ItemGroup, value);
                break;
            default:
                value = super.toProperty(name, value);
                break;

        }

        return value;
    }
}