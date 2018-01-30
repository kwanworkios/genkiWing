import { Data } from './../framework/data/data';
import { Member } from './../framework/data/member';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { ConfigService } from './../framework/services/config.service';
import { Http } from '@angular/http';
import { Injectable } from "@angular/core";
import { BaseService } from "../framework/base/base-service";
import { User } from "../data/user";
import { AQuery } from "../framework/base/aquery";
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class UserService extends BaseService {
    user: User;
    preMember: User;

    public static isViewDidLoadMemberUserDetail = false;

    memberState = 0;

    aq: AQuery;
    isKeepLogin: boolean;

    constructor(private http: Http, public configs: ConfigService, public events: Events, public storage: Storage, public translateService: TranslateService) {
        super();

        this.aq = new AQuery(http, configs);
        this.load();
    }

    load() {
        this.storage.get('jcr.premember').then(premember => {
            if (premember) {
                this.restorePreMember(premember);
            }
        });

        this.storage.get('jcr.user').then(user => {
            if (user) {
                this.restoreUser(user);
            }
        });
    }

    restorePreMember(premember: User) {
        this.preMember = premember;
        this.memberState = 2;
    }

    restoreUser(member: User) {
        this.user = member;
        this.memberState = 1;
    }

    loginUser(email: string, code: string): Observable<any> {
        var url = "/api/v1/jcr/login.json";

        var params = {};
        params['username'] = email;
        params['type'] = 'M';
        params['password'] = code;
        params['brandId'] = 100058;
        var aq = this.aq;
        aq.url = url;
        aq.method = "post";
        aq.params = params;

        return aq.getJson().map((resultMember: any) => {
            try {
                this.putMember(resultMember);
            } catch (err) {
                throw err;
            }

            if (!resultMember['card']) {
                this.memberState = 0;
                let message = this.translateService.instant('app.loginError');
                let err = new Error(message);
                throw err;
            }

            let cardCategory = resultMember['card']['cardcategory'];
            let cardstatus = resultMember['card']['cardstatus'];

            if (cardCategory == '050') {
                switch (cardstatus) {
                    case 'VAL': {
                        // 正常顯示
                        this.memberState = 1;
                        this.events.publish('changeMessageCount');
                        return Data.toData(User, resultMember);
                    }
                    case 'SUS': {
                        // "會藉暫被凍結。" 確定後登出。
                        this.memberState = 0;
                        let message_suspended = this.translateService.instant('app.suspended');
                        let err = new Error(message_suspended);
                        this.logoutUser();
                        throw err;
                    }
                    case 'UPG': {
                        // "會藉已被升級。" 確定後登出。
                        this.memberState = 0;
                        let message_upgraded = this.translateService.instant('app.upgraded');
                        let err = new Error(message_upgraded);
                        this.logoutUser();
                        throw err;
                    }
                    case 'EXP': {
                        // Alert "會藉已過期。" 確定後登出
                        this.memberState = 0;
                        let message_expired = this.translateService.instant('app.expired');
                        let err = new Error(message_expired);
                        this.logoutUser();
                        throw err;
                    }
                }
            } else {
                setTimeout(() => {
                    this.logoutUser();
                }, 500);
                let message = this.translateService.instant('app.loginError');
                let err = new Error(message);
                throw err;
            }
        });
    }
    /**
     * 
     * @param resultMember api response json
     */
    putMember(resultMember) {
        let member = new Member();
        member.id = resultMember['memberId'];
        member.sessionId = resultMember['sessionId'];

        if (this.user) {
            if (this.isKeepLogin) {
                this.configs.putMember(member);
            } else {
                this.configs.member = member;
            }
        } else {
            this.configs.putMember(member);
        }
    }

    logoutUser() {
        this.configs.clearSession();
        this.storage.remove("jcr.user");
        this.handleLogout();
    }

    loginPreMember(email: string, code: string): Observable<any> {
        var url = "/api/v1/jcr/login.json";

        let emailLowerCase;
        try {
            emailLowerCase = email.toLowerCase();
        }
        catch (err) {

        }

        let params = {};
        params["username"] = emailLowerCase;
        params["type"] = "P"  //premember login:type=P
        params["password"] = code;
        params["brandId"] = 100058;

        var aq = this.aq;
        aq.url = url;
        aq.method = "post";
        aq.params = params;

        return aq.getJson().map(resultMember => {
            try {
                this.putMember(resultMember);
            } catch (err) {
                console.log('err:', err);

            }

            if (!resultMember['card']) {
                this.memberState = 0;
                let message = this.translateService.instant('app.loginError');
                let err = new Error(message);
                throw err;
            }

            let cardStatus = resultMember['card']['cardcategory'];
            if (cardStatus == "010") {
                this.memberState = 2;
                return resultMember;
            } else {

                setTimeout(() => {
                    this.logoutPreMember();
                }, 500);

                // 請輸入正確登記帳號及密碼。
                let message = this.translateService.instant("app.loginError");
                let err = new Error(message);
                throw err;
            }
        });
    }

    logoutPreMember() {
        this.configs.clearSession();
        this.storage.remove("jcr.premember");
        this.handleLogout();
    }

    handleLogout() {
        this.storage.remove('sid');
        this.storage.remove('jcr.user');
        this.user = null;
        this.configs.member = null;
        this.memberState = 0;

        let url = '/api/v1/jcr/logout.json';
        var aq = this.aq;
        aq.url = url;
        aq.shouldAuth = true;
        aq.method = 'post';
        var params = {};
        params['brandId'] = 100058;
        aq.params = params;

        aq.getJson().subscribe(null, err => console.log(err));

        this.events.publish('changeMessageCount');
    }

    registerPreMember(username: string, email: string): Observable<any> {
        let url = "/api/v1/jcr/premember.json"

        let params = {};
        params["brandId"] = 100058;
        params["fullname"] = username;

        let emailLowerCase;
        try {
            emailLowerCase = email.toLowerCase();
        }
        catch (err) {
            emailLowerCase = email;
        }

        params["email"] = emailLowerCase;

        let aq = this.aq;
        aq.url = url;
        aq.method = "post";
        aq.params = params;
        return aq.getJson().map(resultMember => {
            try {
                this.putMember(resultMember);
            } catch (err) {
                throw err;
            }
            return resultMember;
        });
    }

    register(pointcardnumber, registrationModel): Observable<any> {
        var url = "/api/v1/jcr/member.json";

        var params = {};
        params["brandId"] = 100058;

        params['pointcardnumber'] = pointcardnumber;
        params['title'] = registrationModel.formA.title;
        params['familyname'] = registrationModel.formA.familyName;
        params['givename'] = registrationModel.formA.giveName;
        params['gender'] = registrationModel.formA.gender;

        let emailLowerCase;
        try {
            emailLowerCase = registrationModel.formA.email.toLowerCase();
        }
        catch (err) {
            emailLowerCase = registrationModel.formA.email;
        }

        params["birthmonth"] = registrationModel.formB.monthOfBirth;
        params["emailaddress"] = emailLowerCase;
        params["mobilephonenumber"] = registrationModel.formB.mobilePhone;
        params["homephonenumber"] = registrationModel.formB.homePhone;

        params["addresscity"] = registrationModel.formB.district;
        params["addressregion"] = registrationModel.formB.region;
        params["addresscountry"] = registrationModel.formB.country;
        params["newpassword"] = registrationModel.formA.password;
        params["maritalstatus"] = registrationModel.formC.marital;
        params["numberofchild"] = registrationModel.formC.childrenNumber;
        params["agegroup"] = registrationModel.formC.age;
        params["occupation"] = registrationModel.formC.occupation;
        params["education"] = registrationModel.formC.education;
        params["monthlyincome"] = registrationModel.formC.income;

        let optIn: string = "1";
        if (registrationModel.rejectPromotion) {
            optIn = "0";
        }
        params["mailingoptin"] = optIn;
        params["emailoptin"] = optIn;
        params["smsoptin"] = optIn;
        params["telephoneoptin"] = optIn;
        params["preferredlanguage"] = registrationModel.formB.language;

        for (var propName in params) {
            var value = params[propName];

            if (value == null || value == undefined) {
                params[propName] = "";
            }
        }

        var aq = this.aq;
        aq.url = url;
        aq.method = "post";
        aq.params = params;

        return aq.getJson().map(json => {
            this.logoutPreMember();
            return json;
        });
    }
}