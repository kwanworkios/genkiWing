import { GroupSelection } from '../data/group-selection';
import { BasicAuth } from './../base/basic-auth';
import { BaseService } from '../base/base-service';
import { Store } from '../data/store';
import { AQuery } from './../base/aquery';
import { Category } from './../data/category';
import { Data } from './../data/data';
import { Item } from './../data/item';
import { ItemGroup } from './../data/item-group';
import { Order } from './../data/order';
import { OrderItem } from './../data/order-item';
import { OrderItemSelection } from './../data/order-item-selection';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';


@Injectable()
export class OrderService extends BaseService {

    aq: AQuery;

    historyOrders: Order[] = [];
    order: Order;

    selections: OrderItemSelection[] = [];

    count: number = 0;
    total: number = 0;
    spot: string;
    session: string;
    currency: string = "CNY";
    sign: string = "¥";
    inflate: boolean = true;

    constructor(private http: Http, public configs: ConfigService) {
        super();

        this.aq = new AQuery(http, configs);
    }

    getOrder(): Order {
        return this.order;
    }

    setCurrency(currency: string){
        if("HKD" == currency){
            this.sign = "$";
        }else if("CNY" == currency){
            this.sign = "¥";
        }else{
            currency = "HKD";
            this.sign = "$";
        }

        this.currency = currency;
    }

    continueOrder() {
        let t = this.order.storeId;
        this.order = new Order();
        this.order.storeId = t;
        this.count = 0;
        this.total = 0;
        this.selections = [];
    }

    createOrder(storeId) {
        this.order = new Order();
        this.order.storeId = storeId;
    }

    clear() {
        this.order = null;
        this.count = 0;
        this.total = 0;
        this.selections = [];
    }


    private calculate() {

        var count = 0;
        var total = 0.0;

        this.selections.forEach(selection => {
            total += selection.getPrice();
            count += selection.quantity;
        });

        this.count = count;
        this.total = total;

        if (this.order) {
            this.order.calculate();
        }
        // this.count = this.order.items.length;
        // this.total = this.order.grandTotal;
    }

    replaceSelection(original: OrderItemSelection, newSelection: OrderItemSelection) {
        var index = this.selections.indexOf(original);

        if (index != -1) {
            this.selections[index] = newSelection;
            this.calculate();
        }
    }

    addSelection(selected: OrderItemSelection) {
        if (!selected.isSet) {
            for (let existing of this.selections) {
                if (existing.same(selected)) {
                    existing.quantity++;
                    this.calculate();
                    return;
                }
            }
        }

        // not found or it is a set, just add it to selected
        this.selections.push(selected);

        this.calculate();
    }

    addOrderItem(store: Store, category: Category, groups: ItemGroup[]) {

        var order = this.order;

        if (order == null) {
            order = new Order();
            order.storeId = store.id;
        }

        var oi = new OrderItem();
        //oi.items = items;
        oi.groups = groups;
        oi.category = category;

        order.orderitems.push(oi);

        this.order = order;

        this.calculate();

    }

    delete(selection: OrderItemSelection) {

        if (this.selections == null) return;

        if (!selection.isSet) {
            selection.quantity--;
        }

        var idx = this.selections.indexOf(selection);

        if (idx != -1) {
            if (selection.isSet || selection.quantity == 0) {
                this.selections.splice(idx, 1);
            }

            this.calculate();
        }

    }

    // delete(orderitem: OrderItem) {

    //     if (this.order == null) return;

    //     var ois = this.order.items;
    //     var idx = ois.indexOf(orderitem);

    //     if (idx != -1) {

    //         ois.splice(idx, 1);
    //         this.calculate();
    //     }

    // }

    quantity(item: Item): Number {
        if (this.count == 0) return 0;

        var count = 0;
        for (let selection of this.selections) {
            if (!selection.isSet) {
                var mainItem: Item = selection.selected[0].items[0];
                if (mainItem.id == item.id) {
                    count = selection.quantity;
                    break;
                }
            }
        }

        return count;
    }

    deleteItem(item: Item) {
        if (this.selections == null || this.count == 0) return;

        var match: OrderItemSelection = null;
        for (let selection of this.selections) {
            if (!selection.isSet) {
                var mainItem: Item = selection.selected[0].items[0];
                if (mainItem.id == item.id) {
                    match = selection
                    break;
                }
            }
        }

        if (match) {
            this.delete(match);
        }
    }

    isEmpty(): boolean {
      
        return this.count == 0;
    }

    placeByodOrderTest(){
        var body = this.makePlaceOrderBody();
        console.log(body);
    }
    
    placeByodOrder(): Observable<Order> {

        var url = "/api/v1/menu/order.json";

        var body = this.makePlaceOrderBody();

        body["type"] = "byod";

        console.log("body", body);

        var aq = this.aq;
        aq.url = url;
        aq.method = "post";
        aq.body = body;

        return aq.auth(true).getJson().map(jo => Data.toData(Order, jo['data']));
    }
    

    placeOrder(): Observable<Order> {
        var url = "/api/v1/menu/order.json";

        var body = this.makePlaceOrderBody();

        console.log("body", body);

        var aq = this.aq;
        aq.url = url;
        aq.method = "post";
        aq.body = body;

        return aq.auth(true).getJson().map(jo => Data.toData(Order, jo['data']));
    }

    makePlaceOrderBody(){

        var body = {};
        body["storeId"] = this.order.storeId;

        if (this.spot) {
            body["spot"] = this.spot;
        }

        if (this.session) {
            body["session"] = this.session;
        }

        var items = [];


        for (let selection of this.selections) {

            if(this.inflate){

                for (var i = 0; i < selection.quantity; i++) {
                    
                    
                    var jo = this.makeOrderItemBody(selection);
                    items.push(jo);
                }

            }else{

                var jo = this.makeOrderItemBody(selection);
                jo.quantity = selection.quantity;
                items.push(jo);

            }

        }

        body["items"] = items;
        return body;
    }


    private makeOrderItemBody(selection: OrderItemSelection): any{

        var jo = {};
        var groupIds = [];
        var itemIds = [];

        for (let selectedItem of selection.selected) {
            selectedItem.items.forEach(item => {
                groupIds.push(selectedItem.group.id);
                itemIds.push(item.id);
            });

        }

        jo["groupIds"] = groupIds;
        jo["itemIds"] = itemIds;
        jo["categoryId"] = selection.category.id;
        return jo;
    }

    getByodOrders(): Observable<Order[]> {
        let url = "/api/v1/menu/order.json";
        let params = {};
        params['type'] = "byod";
        params['session'] = this.session;

        this.aq.url = url;
        this.aq.method = 'get';
        this.aq.params = params;

        return this.aq.auth(true).getJson().map(jo => Data.toDataArray(Order, jo['data']));
    }

    getOrderBySession(id: string, session: string): Observable<Order> {

        let url = "/api/v1/menu/order/" + id + ".json";
        let params = {};
        params['session'] = session;

        this.aq.url = url;
        this.aq.method = 'get';
        this.aq.params = params;

        return this.aq.getJson().map(jo => Data.toData(Order, jo['data']));
    }



    ajaxOrders(): Observable<Order[]> {

        var url = "/api/v1/menu/order.json";
        var params = {};
        params['groupId'] = 1000;

        var aq = this.aq;
        aq.url = url;
        aq.method = 'get';
        aq.params = params;

        return aq.auth(true).getJson().map(jo => Data.toDataArray(Order, jo['data']));
    }

    ajaxTodayOrders(storeId): Observable<Order[]> {
        let url = "/api/v1/menu/order.json";
        let params = {};
        params['storeId'] = storeId;
        params['status'] = 'all';
        let start = new Date();
        start.setHours(0, 0, 0, 0);
        params['start'] = start.toISOString();

        this.aq.url = url;
        this.aq.method = 'get';
        this.aq.params = params;

        return this.aq.auth(true).getJson().map(jo => Data.toDataArray(Order, jo['data']));
    }

    ajaxOrderStatus(order: Order, status: string, path: string = 'menu') {
        let url = "/api/v1/" + path + "/order/" + order.id + ".json";
        let params = {};
        params['status'] = status;

        this.aq.url = url;
        this.aq.method = 'put';
        this.aq.params = params;

        return this.aq.auth(true).getJson().map(jo => Data.toDataArray(Order, jo['data']));
    }

   

}
