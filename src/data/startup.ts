import { Group } from './group';
import { Data } from './../framework/data/data';
export class Startup extends Data {
    group: Group;

    protected toProperty(name: string, value) {
        switch (name) {
            case "tags":
                break;
            case "geos":
                break;
            case "group":
                value = Data.toData(Group, value);
                break;
            default:
                value = super.toProperty(name, value);
                break;
        }
        return value;
    }
}