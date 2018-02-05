import { Data } from './../framework/data/data';
import { AQuery } from './../framework/base/aquery';
import { BaseService } from './../framework/base/base-service';
import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { ConfigService } from '../framework/services/config.service';
import { Observable } from 'rxjs/Observable';
import { Coupon } from '../data/coupon';

@Injectable()
export class CouponService extends BaseService {
    aq: AQuery;

    constructor(http: Http, configService: ConfigService) {
        super();
        this.aq = new AQuery(http, configService);
    }

    getCoupons(): Observable<Coupon[]> {
        var url ="/api/v1/jcr/offer.json?brandId=100058";
        
        var aq = this.aq;
        aq.url = url;
        aq.method = "get";
        aq.shouldAuth=true;
        return aq.getJson().map(json => {
            if(json['data']) {
                return Data.toDataArray(Coupon, json['data']);
            }
        });
    }
}