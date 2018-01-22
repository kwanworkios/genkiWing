import { AQuery } from '../base/aquery';
import { BaseService } from '../base/base-service';
import { Data } from './../data/data';
import { Member } from './../data/member';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class MemberService extends BaseService {

    aq: AQuery;

    constructor(private http: Http, public configs: ConfigService) {
        super();

        this.aq = new AQuery(http, configs);
    }

    login(username: string, password: string): Observable<Member> {

        var url = "/api/v1/store/login.json";
        var aq = this.aq;
        aq.url = url;
        aq.method = "post";

        var params = {"username": username, "password": password};
        aq.params = params;

        return aq.getJson().map(jo => Data.toData(Member, jo['data']));
    }


}