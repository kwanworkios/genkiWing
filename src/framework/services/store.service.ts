import 'rxjs/Rx';
import { AQuery } from '../base/aquery';
import { BaseService } from '../base/base-service';
import { Data } from '../data/data';
import { Store } from '../data/store';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class StoreService extends BaseService {

    aq: AQuery;

    constructor(private http: Http, public configs: ConfigService) {
        super();
        this.aq = new AQuery(http, configs);
    }

    searchStores(groupId: any, q){

        var url = "/api/v1/store/store.json?groupId=" + groupId;

        let params = {};
        params["q"] = q;

        var aq = this.aq;
        aq.url = url;
        aq.params = params;

        return aq.getJson().map(jo => Data.toDataArray(Store, jo['data']));

    }

    getPreOrderStores(groupId: number): Observable<Store[]> {

        var url = "/api/v1/reward/store.json";

        let params = {};
        params["q"] = "feature:preorder";


        var aq = this.aq;
        aq.url = url;
        aq.params = params;

        return aq.getJson().map(jo => Data.toDataArray(Store, jo['data']));
    }

    getPreOrderStore(groupId: number, storeId: number): Observable<Store> {
        
        var url = "/api/v1/reward/store.json";

        let params = {};
        params["q"] = "feature:preorder";


        var aq = this.aq;
        aq.url = url;
        aq.params = params;

        return aq.getJson().flatMap(jo => Data.toDataArray(Store, jo['data']));
    }

    getStore(storeId: number): Observable<Store> {
        let url = "/api/v1/store/store/" + storeId + ".json";

        let aq = this.aq;
        aq.url = url;

        return aq.getJson().map(jo => Data.toData(Store, jo['data']));
    }

    putStoreDelay(storeId: number, delay: number): Observable<Store> {
        let url = "/api/v1/yoshinoya/store/" + storeId + ".json";

        let params = {};
        params['delay'] = delay;

        this.aq.url = url;
        this.aq.params = params;
        this.aq.method = 'put';

        return this.aq.auth(true).getJson().map(jo => Data.toData(Store, jo['data']));
    }
}
