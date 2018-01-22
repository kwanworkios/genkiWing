import { Injectable } from '@angular/core';
declare var google;
const url = 'http://maps.google.com/maps/api/js?key=AIzaSyA9HqY1fxNNkMOal_k-whpcsq-BMyn7OGo&callback=__onGoogleLoaded';

@Injectable()
export class GoogleMapsLoader {
    private static promise: Promise<any>;
    private static head = document.getElementsByTagName('head')[0];
    public static language = "zh-TW";
    public static isMapLoaded = false;
    public static loadGoogleMapScript(language?: string) {
        this.promise = new Promise(resolve => {
            if(language != 'zh') {
                this.language = language;
            } else {
                this.language = "zh-TW";
            }

            window['__onGoogleLoaded'] = (ev) => {
                this.isMapLoaded = true;
                resolve('google maps api loaded');
            };

            let node = document.createElement('script');
            let urlWithLanguage = url + "&language=" + this.language;
            node.src = urlWithLanguage;
            node.type = "text/javascript";
            node.id = "google-maps-script";
            this.head.appendChild(node);
        });
        return this.promise;
    }

    public static changeGoogleMapsLanguage(language: string) {
        if(language != 'zh') {
            this.language = language;
        } else {
            this.language = "zh-TW";
        }
        let oldScript = document.getElementById("google-maps-script");
        oldScript.parentNode.removeChild(oldScript);
        var scripts = document.querySelectorAll("script[src*='maps.google']"); 
        for (var i = 0; i < scripts.length; i++) {
            scripts[i].parentNode.removeChild(scripts[i]);
        }

        delete google.maps;
        this.loadGoogleMapScript();
    }
}