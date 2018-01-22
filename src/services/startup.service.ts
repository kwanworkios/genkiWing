import { Data } from './../framework/data/data';
import { Observable } from 'rxjs';
import { ConfigService } from './../framework/services/config.service';
import { Http } from '@angular/http';
import { BaseService } from './../framework/base/base-service';
import { Injectable } from '@angular/core';
import { AQuery } from '../framework/base/aquery';
import { Startup } from '../data/startup';
import { Storage } from '@ionic/storage';
import { AppVersion } from '@ionic-native/app-version';
@Injectable()
export class StartupService extends BaseService{
    private startupKey = 'jcr.startup';
    private aq: AQuery;
    startup: Startup;

    constructor(private http: Http, public configService: ConfigService, public storage: Storage, public appversion: AppVersion) {
        super();
        this.aq = new AQuery(http, configService);
    }

    saveStartup(startup: Startup) {
        this.startup = startup;
        this.saveToStorage();
    }

    saveToStorage() {
        this.storage.ready().then(() => {
            this.storage.set(this.startupKey, this.startup);
        });
    }

    getStorageStartup() {
        return this.storage.ready().then(() => {
            return this.storage.get(this.startupKey).then((startup: Startup) => {
                return startup;
            });
        });
    }

    getLocalStartup(): Startup {
        return this.startup;
    }

    getStartup(lang?): Observable<Startup> {
        var url = "/api/v1/jcr/genki.json";
        var aq = this.aq;
        aq.url = url;
        aq.method = 'get';
        var params = {};
        if(lang) {
            params['locale'] = lang;
        }
        aq.params = params;

        return aq.getJson().map((jo) => {
            return Data.toData(Startup, jo['data']);
        });
    }

    async getAppInfo() {
        let versionNumber;
        try {
            versionNumber = await this.appversion.getVersionNumber();
        } catch (e) {
            console.log('get verison error');
            versionNumber = this.configService.getVersionCode();
        }
        return versionNumber;
    }
}
