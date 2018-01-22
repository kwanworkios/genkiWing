import { AQuery } from '../base/aquery';
import { BaseService } from '../base/base-service';
import { Charge } from '../data/charge';
import { Data } from '../data/data';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentService extends BaseService {

    aq: AQuery;

    constructor(private http: Http, public configs: ConfigService) {
        super();
        this.aq = new AQuery(http, configs);
    }


    payStripeCharge(token: string, charge: Charge): Observable<Charge> {

        var url = "/api/v1/pay/charge.json";

        var params = {};
        params["type"] = charge.type;
        params["token"] = token;
        params["amount"] = charge.amount;
        params["currency"] = charge.currency;
        params["groupId"] = "100";
        params["email"] = charge.email;
        params["subtype"] = charge.subtype;
        params["method"] = charge.method;

        if(charge.payeeId){
            params["payeeId"] = charge.payeeId;
        }

        var aq = this.aq;
        aq.url = url;
        aq.method = "post";
        aq.params = params;

        return aq.getJson().map(jo => Data.toData(Charge, jo['data']));


    }


}
