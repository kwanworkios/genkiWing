import { Data } from './data';
import { Category } from './category';
import { ItemGroup } from './item-group';
import { Item } from './item';


export class GroupSelection {
    items: Item[] = [];
    group: ItemGroup;
    groupId: string;
    itemIds: string[] = [];
    noNeed: boolean;

    constructor(group: ItemGroup) {
        this.group = group;
        this.groupId = group.id;
        this.items = [];
        this.itemIds = [''];
        this.noNeed = false;
    }

    public clone(): GroupSelection {
        var selection = new GroupSelection(this.group);
        selection.items = [];
        this.items.forEach(item => {
            selection.items.push(item);
        })
        this.itemIds.forEach(id => {
            selection.itemIds.push(id);
        });
        selection.noNeed = this.noNeed;
        return selection;
    }

    same(another: GroupSelection): boolean {
        // if (this.groupId != another.groupId) {
        //     return false;    
        // }
        
        if (this.items == null && another.items == null) {
            return true;
        }

        if (this.items.length != another.items.length) {
            return false;
        }

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].id != another.items[i].id) {
                return false;
            }
        }

        return true;
    }

    getPrice(): number {
        var price = 0.0;

        if (!this.noNeed) {
            this.items.forEach(item => {
                price += item.price;
            });
        }
        
        return price;
    }

    hasSelectedItem(): boolean {
        return this.items != null && this.items.length > 0 && !this.noNeed;
    }
}