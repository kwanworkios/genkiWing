import { Field } from '../data/field';
import { AQuery } from '../base/aquery';
import { BaseService } from '../base/base-service';
import { Data } from '../data/data';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class DataService extends BaseService {

    aq: AQuery;

    constructor(private http: Http, public configs: ConfigService) {
        super();

        this.aq = new AQuery(http, configs);
    }



    getDataList<T extends Data>(ptype:string, type:string, pid: any, pfield: string, searchField:Field): Observable<any[]> {

        var url = "/api/v1/cms/list.json";

        var params = {
            type:type,
            ptype:ptype,
            pid:pid,
            pfield:pfield
        };

        if(searchField){
            params['search'] = searchField.name;
            params['query'] = searchField.value;
        }

        var aq = this.aq;
        aq.url = url;
        aq.params = params;

        return aq.auth(true).getJson().map(jo => jo['data']);
    }

    appendContext(parent: any, url: string, id: any){

        if(id){
            url += "&id=" + id;
        }

        if(parent){

            console.log("conext?", parent);

            var brandId = parent.brandId;
            

            var cls = parent['class'];
            if(!cls){
                cls = parent.constructor.name;
            }
            

            if(cls == 'Brand'){
                brandId = parent.id;
            }

            var storeId = parent.storeId;
            if(cls == 'Store'){
                storeId = parent.id;
            }

            if(brandId){
                url += "&brandId=" + brandId; 
            }
            if(storeId){
                url += "&storeId=" + storeId; 
            }

            url += "&ptype=" + cls;
            url += "&pid=" + parent.id;
        }



      
        return url;

    }

    getData(parent: any, type: string, id: any): Observable<any> {

        var url = "/api/v1/cms/data.json?type=" + type;

        url = this.appendContext(parent, url, id);

        var aq = this.aq;
        aq.url = url;

        
        return aq.auth(true).getJson().map(jo => jo['data']);
    }

    getConfig(groupId: number, brandId: number, storeId: number, console: boolean): Observable<any> {

        var url = "/api/v1/cms/config.json?";

        var params = {};

        if(groupId && groupId != 0){
            params["groupId"] = groupId;
        }

        if(brandId && brandId != 0){
            params["brandId"] = brandId; 
        }

        if(storeId && storeId != 0){
            params["storeId"] = storeId;
        }

        if(console){
            params["console"] = true;
        }

      
        var aq = this.aq;
        aq.url = url;
        aq.params = params;
       
        return aq.auth(true).getJson().map(jo => jo['data']);
    }    

    saveConfig(groupId: number, brandId: number, storeId: number, config: any): Observable<any> {

        var url = "/api/v1/cms/config.json?console=true";

        if(groupId && groupId != 0){
            url += "&groupId=" + groupId; 
        }

        if(brandId && brandId != 0){
            url += "&brandId=" + brandId; 
        }

        if(storeId && storeId != 0){
            url += "&storeId=" + storeId; 
        }

      
        var aq = this.aq;
        aq.url = url;
        aq.method = "post";
        aq.body = config;

       
        return aq.auth(true).getJson().map(jo => jo['data']);
    }  

    pushFile(id: any): Observable<any> {
        
        var url = "/api/v1/cms/file/" + id + ".json"; 

        var params = {};
        params["action"] = "push";

        
        var aq = this.aq;
        aq.url = url;
        aq.method = "put";
        aq.params = params;

        return aq.auth(true).getJson().map(jo => jo['data']);
    }


    postData(parent: any, type: string, id: any, fields: any[]): Observable<any> {
        
        var url = "/api/v1/cms/data.json?type=" + type; 

        url = this.appendContext(parent, url, id);
        
       
        var body = {};
        body["fields"] = fields;

        console.log("body", body);

        var aq = this.aq;
        aq.url = url;
        aq.method = "post";
        aq.body = body;

        return aq.auth(true).getJson().map(jo => jo['data']);
    }

    deleteData(parent: any, type: string, id: any): Observable<any> {
        
        var url = "/api/v1/cms/data.json?type=" + type; 

        url = this.appendContext(parent, url, id);

        var aq = this.aq;
        aq.url = url;
        aq.method = "delete";

        return aq.auth(true).getJson().map(jo => jo['data']);
    }

    postImage(type: string, id: any, field: any, file: File) : Observable<any>{

        let formData = new FormData();

        let host = this.configs.getApi();

        let url = host + "/api/v1/cms/data/image.json?type=" + type + "&id=" + id + "&name=" + field.name;

        let sid = this.configs.getSessionId();
        if(sid){
            url += "&sid=" + sid;
        }

        formData.append('data', file);
            
        return this.http.post(url, formData).map(r => r.json()['data']);
        

    }
    
    deleteImage(type: string, id: any, field: any) : Observable<any>{

        let url = "/api/v1/cms/data/image.json?delete=true&type=" + type + "&id=" + id + "&name=" + field.name;
            
        var aq = this.aq;
        aq.url = url;
        aq.method = "post";
        return aq.auth(true).auth(true).getJson().map(jo => jo['data']);
        

    }

    postSequence(type: string, ctype: string, id: any, sortIds: any[]) : Observable<any>{

        let url = "/api/v1/cms/data.json";
            
        var ids = sortIds.join(",");

        var params = {
            type: type,
            id: id,
            child: ctype,
            sortIds: ids
        };

        var aq = this.aq;
        aq.url = url;
        aq.method = "post";
        aq.params = params;

        return aq.auth(true).getJson().map(jo => jo['data']);
        

    }


}
