import { BasicAuth } from './basic-auth';
import { ConfigService } from '../services/config.service';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

export class AQuery {

    http: Http;
    method: string;
    params: {};
    url: string;
    headers: {};
    configs: ConfigService;
    body: {};
    shouldAuth: boolean = false;
    authorization: BasicAuth;
    data: ArrayBuffer;

    constructor(http: Http, configs: ConfigService) {
        this.http = http;
        this.configs = configs;
        this.clear();
    }


    private clear() {
        this.method = "get";
        this.params = {};
        this.url = null;
        this.body = null;
        this.headers = {};
        this.shouldAuth = false;
        this.authorization = null;
        this.data = null;
    }

    private getDefaultHeaders(inputs: {}): Headers {
        let headers = new Headers();


        for (var key in inputs) {
            var value = inputs[key];
            headers.set(key, value + "");
        }

        console.log("should auth?", this.shouldAuth || this.authorization);
        if (this.authorization) {
            headers.set('AUTHORIZATION', 'Basic ' + this.authorization.getAuth());
        } else {
            if (this.shouldAuth) {
                headers.set('sid', this.configs.getSessionId());
            }
        }

        return headers;
    }

    auth(auth: boolean): AQuery {
        this.shouldAuth = auth;
        return this;
    }
 
    basicAuth(auth: BasicAuth): AQuery {
        this.authorization = auth;
        return this;
    }

    protected getParams(inputs: {}): URLSearchParams {
        let params: URLSearchParams = new URLSearchParams();
        
        var groupId = this.configs.getGroupId();
        
        if(groupId && !params["groupId"] && this.url.indexOf("groupId") == -1){
            params.set('groupId', groupId);
        }

        var lang = this.configs.getLocale();

        console.log("lang!!!!", lang);

        if(lang){
            params.set('locale', lang);
        }

        var country = this.configs.getCountry();
        if(country){
            params.set('country', country);
        }

        for (var key in inputs) {
            var value = inputs[key];
            if(value != null){
                params.set(key, value + "");
            }
        }

        return params;
    }

    public getJson(): Observable<Object> {

        var result = this.doHttp();
        this.clear();
        return result;
    }

    private doHttp(): Observable<Object> {

        var url = this.url;

        if (url.indexOf("/") == 0) {
            url = this.configs.getApi() + url;
        }

        var params = this.params;
        var headers = this.headers;
        var method = this.method;

        var searchParams = this.getParams(params);
        var httpHeaders = this.getDefaultHeaders(headers);


        console.log(method, url, searchParams, httpHeaders);

        if ("get" == method) {
            return this.http.get(url, { search: searchParams, headers: httpHeaders }).map(r => r.json());
        } else if ("post" == method || "put" == method || "delete" == method) {

            var body = this.body;
            if (this.body) {
                httpHeaders.set("Content-Type", "application/json"),
                    body = JSON.stringify(this.body);

                if("post" == method){
                    return this.http.post(url, body, { search: searchParams, headers: httpHeaders }).map(r => r.json());
                }else if("put" == method){
                    return this.http.put(url, body, { search: searchParams, headers: httpHeaders }).map(r => r.json());
                }else if("delete" == method){
                    return this.http.delete(url, { search: searchParams, headers: httpHeaders }).map(r => r.json());
                }
            } else if (this.data) {
                if ('post' == method) {
                    return this.http.post(url, this.data).map(r => r.json());
                }
            } else {
                httpHeaders.set('Content-Type', 'application/x-www-form-urlencoded');
                body = searchParams.toString();

                if("post" == method){
                    return this.http.post(url, body, { headers: httpHeaders }).map(r => r.json());
                }else if("put" == method){
                    return this.http.put(url, body, { headers: httpHeaders }).map(r => r.json());
                }else if("delete" == method){
                    return this.http.delete(url, { headers: httpHeaders }).map(r => r.json());
                }

                
            }


        }/* else if ("put" == method) {

            var body = this.body;
            if (this.body) {
                httpHeaders.set("Content-Type", "application/json"),
                    body = JSON.stringify(this.body);

                return this.http.put(url, body, { search: searchParams, headers: httpHeaders }).map(r => r.json());
            } else {
                httpHeaders.set('Content-Type', 'application/x-www-form-urlencoded');
                body = searchParams.toString();
                return this.http.put(url, body, { headers: httpHeaders }).map(r => r.json());
            }

        }*/



    }


}