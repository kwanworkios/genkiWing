import { Data } from './data';
import { Category } from './category';
import { ItemGroup } from './item-group';
import { Item } from './item';


export class OrderItem extends Data {
    id: string;
    total: number = 0;
    items: Item[] = [];
    groups: ItemGroup[] = [];
    groupIds: string[] = [];
    itemIds: string[] = [];
    categoryId: string;
    category: Category;
    quantity: number = 1;
}