import { BehaviorSubject } from 'rxjs/Rx';
import { Config } from '../../app/config';
import { Member } from '../data/member';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
//import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Cookie } from 'ng2-cookies';

@Injectable()
export class ConfigService {

    memberSubject: BehaviorSubject<Member>;
    member: Member;
    config: Config;
    brandId: string;
    loginPage: any;
    configRegion: string;
    app: any;

    constructor(public storage: Storage) {
        //super();
        this.load();
        this.config = new Config();

        this.memberSubject = new BehaviorSubject<Member>(null);
    }

    setRegion(name: string) {

        this.configRegion = name;
        this.setCookie("config.region", name);

    }

    restoreRegion() {
        this.configRegion = this.getCookie("config.region");
    }

    getRegion(): string {
        //this.configService.config.default.name;
        return this.configRegion;
    }

    get(name: string): string {
        var map = null;

        if (this.configRegion) {
            map = this.config[this.configRegion];
        }

        if (!map) {
            map = this.config.default;
        }

        return map[name];
    }

    getApi(): string {
        return this.get("api");
    }

    getLocale(): string {

        var locale: string = this.getCookie("locale");
        if (!locale) {
            locale = this.get("locale");
        }

        return locale;

    }

    setLocale(locale: string) {

        this.setCookie("locale", locale);

    }

    getCountry(): string {

        return this.get("country");

    }

    getGroupId(): string {
        return this.get("groupId");
    }

    getBrandId(): string {
        return this.brandId;
    }

    setBrandId(brandId: string) {
        this.brandId = brandId;
    }

    putPreference(key: string, value: any) {

        this.storage.set(key, value);

    }

    isAdmin() {

        var member = this.getMember();
        if (member) {
            return member.admin == true;
        }

        return false;

    }

    isDev() {

        // return this.config.dev == this.config.default;

    }

    isLocalhost() {

        return window.location.hostname == "localhost";

    }

    isPrd() {

        if (this.config.default["production"]) {
            return true;
        }

        return false;
    }

    load() {


        this.getPreference("aigens.member").then((member) => {

            console.log("member loaded", member);

            if (member) {
                this.member = member;
                this.memberSubject.next(member);
                this.setCookie("sid", member.sessionId);
            }


        })



    }

    putMember(member: Member) {
        this.member = member;
        this.memberSubject.next(member);
        this.setCookie("sid", member.sessionId);
        this.storage.set("aigens.member", member);
    }

    clearSession() {
        this.member = null;
        this.setCookie("sid", null);
        this.storage.set("aigens.member", null);
    }

    getMember(): Member {

        return this.member;
    }

    getSessionId(): string {
        var member = this.getMember();
        if (member) return member.sessionId;
        return this.getCookie("sid");
    }

    setCookie(name: string, value: string) {
        //Cookie.set(name, value);
        //this.cookieService.put(name, value);
        Cookie.set(name, value);
    }

    getCookie(name: string): string {
        //return Cookie.get(name);
        //return this.cookieService.get(name);



        return Cookie.get(name);
    }

    getPreference(key: string): Promise<any> {
        return this.storage.get(key);
    }

    setLocal(key: string, object: any) {

        localStorage.setItem(key, JSON.stringify(object));

    }

    getLocal(key: string): any {
        var str = localStorage.getItem(key);
        if (str == null) return null;
        return JSON.parse(str);
    }

    getVersionCode(): string {
        return this.config["version"];
    }

}