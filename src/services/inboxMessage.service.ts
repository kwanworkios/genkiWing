import { Data } from './../framework/data/data';
import { Notice } from './../data/notice';
import { Http } from '@angular/http';
import { AQuery } from './../framework/base/aquery';
import { Injectable } from "@angular/core";
import { BaseService } from "../framework/base/base-service";
import { Storage } from '@ionic/storage';
import { ConfigService } from '../framework/services/config.service';

@Injectable()
export class InboxMessageService extends BaseService {
    popularizeMessageKey = 'jcr.popularizeMessage';
    personalMessageKey = 'jcr.personalMessageKey';

    readMessageIds: number[];
    readPersonalMessageIds: number[];
    unReadMsgIdsCount: number = 0;
    unReadPersonalMsgIdsCount: number = 0;

    message: any[];
    personalMessage: any[];

    aq: AQuery;

    constructor(private http: Http, public storage: Storage, public configs: ConfigService) {
        super();
        this.aq = new AQuery(http, configs);

        this.readMessageIds = [];
        this.readPersonalMessageIds = [];
    }

    setMessageIds(messageId: number, read: boolean) {
        if (read && (this.readMessageIds.indexOf(messageId) == -1)) {
            if (this.readMessageIds) {
                this.readMessageIds.push(messageId);
            }
        }
    }

    setPersonalMessageIds(messageId: number, read: boolean) {
        if (read && (this.readPersonalMessageIds.indexOf(messageId) == -1)) {
            if (this.readPersonalMessageIds) {
                this.readPersonalMessageIds.push(messageId);
            }
        }
    }

    getMsgIds(): any {
        return this.readMessageIds;
    }

    getPersonalMsgIds(): any {
        return this.readPersonalMessageIds;
    }

    saveMessageIds() {
        this.storage.ready().then(() => {
            this.storage.set(this.popularizeMessageKey, this.readMessageIds);
        });
    }

    savePersonalMessageIds() {
        this.storage.ready().then(() => {
            this.storage.set(this.personalMessageKey, this.readPersonalMessageIds);
        });
    }

    setMessage(message: Array<Notice>) {
        this.message = message;
    }

    setPersonalMessage(message: Array<Notice>) {
        this.personalMessage = message;
    }

    unReadMsgCount() {
        this.unReadMsgIdsCount = 0;

        return this.storage.ready().then(() => {
            return this.storage.get(this.popularizeMessageKey).then(value => {
                if (value) {
                    let a: number[] = value;
                    this.readMessageIds = a;

                    if(this.message) {
                        this.message.forEach(msg => {
                            if(this.readMessageIds.indexOf(msg) == -1) {
                                this.unReadMsgIdsCount += 1;
                            }
                        });
                    }

                    return this.unReadMsgIdsCount;
                } else {
                    return this.message.length;
                }
            });
        });
    }

    /*
        unReadPersonalMsgCount() {
            console.log("unReadPersonalMsgCount");
            this.unReadPersonalMsgIDsCount = 0;
            if (this.personalMessage) {
    
                for (let i = 0; i < this.personalMessage.length; i++) {
                    if (this.readPersonalMessageIDs.indexOf(this.personalMessage[i].id) == - 1) {
                        this.unReadPersonalMsgIDsCount = this.unReadPersonalMsgIDsCount + 1;
                    }
                }
    
                // this.personalMessage.forEach((message) => {
                //     if (this.readPersonalMessageIDs.indexOf(message.id) == - 1) {
                //         this.unReadPersonalMsgIDsCount = this.unReadPersonalMsgIDsCount + 1;
                //     }
                // });
                // return this.unReadPersonalMsgIDsCount;
            }
    
            // else {
            // }
    
            return this.unReadPersonalMsgIDsCount;
            //console.log("unReadMunReadPersonalMsgCountsgCount",this.unReadPersonalMsgIDsCount);
    
        }
    
    */

    getGlobalNotice(lang?) {
        let url = '/api/v1/jcr/notice.json?brandId=100058';
        var aq = this.aq;
        aq.url = url;
        aq.method = 'get';
        aq.shouldAuth = true;

        var params = {};
        if(lang) {
            params['locale'] = lang;
        }
        aq.params = params;

        return aq.getJson().map(json => Data.toDataArray(Notice, json['data']));
    }
}