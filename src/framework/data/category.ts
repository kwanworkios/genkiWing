import { Data } from './data';
import { ItemGroup } from './item-group';
export class Category extends Data {
    id: string;
    name: string;
    groups: ItemGroup[] = [];
    published: boolean;

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