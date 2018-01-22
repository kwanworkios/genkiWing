import { Item } from '../data/item';
import { ItemGroup } from '../data/item-group';
import { Menu } from '../data/menu';
import { AQuery } from '../base/aquery';
import { BaseService } from '../base/base-service';
import { Data } from '../data/data';
import { Store } from '../data/store';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class MenuService extends BaseService {

    aq: AQuery;

    constructor(private http: Http, public configs: ConfigService) {
        super();

        this.aq = new AQuery(http, configs);
    }

    getMenus(brandId: any): Observable<Menu[]> {

        var url = "/api/v1/menu/menu.json?unknown=true&brandId=" + brandId;

        var aq = this.aq;
        aq.url = url;

        return aq.auth(true).getJson().map(jo => Data.toDataArray(Menu, jo['data']));
    }

    getItemGroups(menuId: any): Observable<ItemGroup[]> {

        var url = "/api/v1/menu/group.json?menuId=" + menuId;

        var aq = this.aq;
        aq.url = url;

        return aq.auth(true).getJson().map(jo => Data.toDataArray(ItemGroup, jo['data']));
    }

    getItems(menuId: any): Observable<Item[]> {

        var url = "/api/v1/menu/item.json?menuId=" + menuId;

        var aq = this.aq;
        aq.url = url;

        return aq.auth(true).getJson().map(jo => Data.toDataArray(Item, jo['data']));
    }        

    getMenu(id: string): Observable<Menu> {

        var url = "/api/v1/menu/menu/" + id + ".json";

        var aq = this.aq;
        aq.url = url;

        return aq.getJson().map(jo => Data.toData(Menu, jo['data']));
    }

    getStore(id: number): Observable<Store> {

        var url = "/api/v1/menu/store/" + id + ".json?available=true";

        //return this.http.get(url, {search: this.getParams()}).map(r => r.json().data as Store);
        //return this.http.get(url, {search: this.getParams()}).map(r => Data.toData(Store, r.json().data));


        var aq = this.aq;
        aq.url = url;

        return aq.getJson().map(jo => Data.toData(Store, jo['data']));
    }

    getFullStore(id: number): Observable<Store> {

        var url = "/api/v1/menu/store/" + id + ".json";

        var aq = this.aq;
        aq.url = url;

        return aq.getJson().map(jo => Data.toData(Store, jo['data']));
    }


}
