import { ConfigService } from './../framework/services/config.service';
import { Http } from '@angular/http';
import { Injectable } from "@angular/core";
import { BaseService } from "../framework/base/base-service";
import { AQuery } from "../framework/base/aquery";
import { Ticket } from "../data/ticket";
import { Observable } from 'rxjs/Observable';
import { Data } from '../framework/data/data';

@Injectable()
export class QueuingService extends BaseService {
    aq: AQuery;
    ticket: Ticket;

    public static isQueuingViewDidLoad = false;

    public static isQueuingShowTicketDidLoad = false;

    constructor(private http: Http, public configService: ConfigService) {
        super();
        this.aq = new AQuery(http, configService);
    }

    getQueuesAllData(storeId: number): Observable<any> {
        var url = '/api/v1/queue/queue.json';

        var params = {};
        params['storeId'] = storeId;

        var aq = this.aq;
        aq.url = url;
        aq.method = "get";
        aq.params = params;
        aq.shouldAuth = true;
        return aq.getJson();
    }

    getQueuingStore(isSuperAcct: boolean, latLng?: { lat: number, lng: number }): Observable<any> {
        var url = '/api/v1/jcr/storequeue.json?brandId=100058';
        var aq = this.aq;
        aq.url = url;
        aq.method = 'get';
        aq.shouldAuth = true;
        var params = {};
        if (latLng) {
            params["latitude"] = latLng.lat;
            params["longitude"] = latLng.lng;
        }
        if (isSuperAcct) {
            params["radius"] = "1000000";
        }
        aq.params = params;

        return aq.getJson();
    }

    takeTicket(storeId, seats, name, phone?): Observable<Ticket> {
        var url = '/api/v1/queue/ticket.json';
        var params = {};
        params['storeId'] = storeId;
        params['seats'] = seats;
        params['phone'] = phone;
        params['name'] = name;

        var aq = this.aq;
        aq.url = url;
        aq.method = "post";
        aq.params = params;
        aq.auth(true);

        return aq.getJson().map(json => Data.toData(Ticket, json['data']));
    }

    showTicketDetail(id) {
        if (!id) {
            return null;
        }
        var url = "/api/v1/queue/ticket/" + id + ".json";

        var aq = this.aq;
        aq.url = url;
        aq.method = "get";
        aq.auth(true);

        return aq.getJson().map(json => json['data']);
    }


    listUserTicket(): Observable<Ticket[]> {
        // var url = "/api/v1/queue/ticket.json?fields=brand,store,member&groupId=10000";
        // var url = "/api/v1/queue/ticket.json?fields=store,member&groupId=10000";
        var url = "/api/v1/jcr/ticket.json?fields=brand,store,member&groupId=10000";

        var aq = this.aq;
        aq.url = url;
        aq.method = "get";
        aq.auth(true);

        return aq.getJson().map(json => Data.toDataArray(Ticket, json['data']));
    }

    cancelTicket(ticketId) {
        var url = "/api/v1/queue/ticket/" + ticketId + ".json";

        var params = {};
        params["action"] = "cancel";
        // params["native"] = true;

        var aq = this.aq;
        aq.url = url;
        aq.method = "put";
        aq.auth(true);
        aq.params = params;

        // return aq.getJson().map(json => Data.toDataArray(Ticket, json['data']));
        return aq.getJson();
    }
}