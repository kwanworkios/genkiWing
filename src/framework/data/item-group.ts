import { Data } from './data';
import { Item } from './item';
export class ItemGroup extends Data {
    id: string;
    name: string;
    items: Item[];
    modifier: boolean = false;
    optional: boolean = false;
    tags: string[] = [];
    choices: number = 1;

    selected: Item[];

    getSelectedNames(){
       
        var names = [];
        for(let item of this.selected){
          
            names.push(item.name);
        }
         
        return names.join();
    }

    getSelectedItemIds(){
       
        var names = [];
        for(let item of this.selected){
       
            names.push(item.id);
        }
         
        return names.join();
    }

    protected toProperty(name: string, value) {

        switch (name) {

            case "items":
                value = Data.toDataArray(Item, value);
                break;
            default:
                value = super.toProperty(name, value);
                break;
        }

        return value;
    }

}