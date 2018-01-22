import { Item } from './item';
import { GroupSelection } from './group-selection';
import { Category } from './category';


export class OrderItemSelection {
    categoryId: string;
    category: Category;
    selected: GroupSelection[] = [];
    isSet: boolean;
    quantity: number = 0;

    constructor(category: Category, mainItem: Item) {
        this.category = category;
        this.categoryId = category.id;
        this.isSet = this.checkSet(this.category, mainItem);
        this.quantity = 0;

        //if the item is a set with sub items under main item
        if(mainItem.groups && mainItem.groups.length > 0){

            var selection: GroupSelection = new GroupSelection(category.groups[0]);
            this.selected.push(selection);

            for (let group of mainItem.groups) {
                selection = new GroupSelection(group);

                if(!group.optional && group.items.length == 1){
                    selection.items = [group.items[0]];
                }

                
                this.selected.push(selection);
            }

            this.selected[0].items = [mainItem];
            
            this.quantity = 1;

        }else{

            for (let group of category.groups) {
                var selection: GroupSelection = new GroupSelection(group);

                if(!group.optional && group.items.length == 1){
                    selection.items = [group.items[0]];
                }

                this.selected.push(selection);
            }

            this.selected[0].items = [mainItem];
            this.quantity = 1;
        }

        
    }

    private checkSet(cat: Category, item: Item){
        if(item.groups && item.groups.length > 0) return true;
        if(cat.groups && cat.groups.length > 1){
            return true;
        }
        return false;
    }   

    public clone() {
        var instance: OrderItemSelection = new OrderItemSelection(this.category, this.selected[0].items[0]);
        instance.isSet = this.isSet;
        instance.quantity = this.quantity;
        instance.selected = [];

        this.selected.forEach(selectedItem => {
            instance.selected.push(selectedItem.clone());
        });

        return instance;
    }

    same(another:OrderItemSelection): boolean {
        if ((this.isSet || another.isSet) && this.categoryId != another.categoryId) {
            console.log('not same category');
            return false;
        }

        // there should always be some items in selected
        if (this.selected == null && another.selected == null) {
            return true;
        }

        if (this.selected.length != this.selected.length) {
            return false;
        }

        for (var i = 0; i < this.selected.length; i++) {
            if (!this.selected[i].same(another.selected[i])) {
                console.log('not all items same');
                return false;
            }
        }

        return true;
    }

    completed(): boolean {
        if (this.selected == null || this.selected.length == 0) {
            return false;
        }

        for (let selection of this.selected) {
            if (!selection.group.optional && !selection.group.modifier) {
                if (selection.items == null || selection.items.length == 0) {
                    return false;
                }
            }
        }

        return true;
    }

    getPrice(): number {
        var price = 0;

        this.selected.forEach(selected => {
            price += selected.getPrice();
        });

        return price * this.quantity;
    }

    getSelectedItems() {
        return this.selected.filter(item => item.hasSelectedItem());
    }
}