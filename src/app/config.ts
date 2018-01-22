export class Config {

    jcr = {
        api: "https://mxjcrtest.appspot.com",
        groupId: "10000",
        country: "hk",
        locale: "zh",
        topic: "genki.global.test"
    }

    jcr_aigens = {
        api: "https://mxjcrtest.aigens.com",
        groupId: "10000",
        country: "hk",
        locale: "zh",
        topic: "genki.global"
    }

    jcr_uat = {
        production: false,
        version: "0.1.18",
        api: "https://jcruat.aigens.com",
        groupId: "10000",
        country: "hk",
        locale: "zh",
        topic: "genki.global.test",
        topic_zh: "genki.global-zh.test",
        member_info_URL_zh: "http://prodev03.fevaworks.net/2015/Genki_website_revamp/Genki/member_system/tc/app_member_info.php",
        member_info_URL_en: "http://prodev03.fevaworks.net/2015/Genki_website_revamp/Genki/member_system/en/app_member_info.php",
        member_transaction_zh: "http://prodev03.fevaworks.net/2015/Genki_website_revamp/Genki/member_system/tc/app_member_bill.php",
        member_transaction_en: "http://prodev03.fevaworks.net/2015/Genki_website_revamp/Genki/member_system/en/app_member_bill.php",
        member_forget_password_URL_zh: "http://prodev03.fevaworks.net/2015/Genki_website_revamp/Genki/member_system/tc/app_forget_password.php",
        member_forget_password_URL_en: "http://prodev03.fevaworks.net/2015/Genki_website_revamp/Genki/member_system/en/app_forget_password.php",
        google_analytics_key_android: "UA-103811361-1",
        google_analytics_key_ios: "UA-103784474-1",
        flurry_analytics_android: "RNRYB8CNP5DJWKQZ247X",
        flurry_analytics_ios: "J56QR8Y8CNC48YD36V4P",
        hockeyapp_appid_android: "4f00084b6cd2404e9154561321423821",
        hockeyapp_appid_ios: "288a0a6795b940ecb3e0a1ee1ad32fcd",
    }

    jcr_prd = {
        production: true,
        version: "3.2.1",
        api: "https://jcrapps-prd.maxims.com.hk",
        groupId: "10000",
        country: "hk",
        locale: "zh",
        topic: "genki.global",
        topic_zh: "genki.global-zh",
        member_info_URL_zh: "https://members.genkisushi.com.hk/tc/app_member_info.php",
        member_info_URL_en: "https://members.genkisushi.com.hk/en/app_member_info.php",
        member_transaction_zh: "https://members.genkisushi.com.hk/tc/app_member_bill.php",
        member_transaction_en: "https://members.genkisushi.com.hk/en/app_member_bill.php",
        member_forget_password_URL_zh: "https://members.genkisushi.com.hk/tc/app_forget_password.php",
        member_forget_password_URL_en: "https://members.genkisushi.com.hk/en/app_forget_password.php",
        google_analytics_key_android: "UA-103798170-1",
        google_analytics_key_ios: "UA-103779808-1",
        flurry_analytics_android: "6XNSQHJV2B45RHWVFJSY",
        flurry_analytics_ios: "9X5PYFWQ7WZYMWFYTS2Q",
        hockeyapp_appid_android: "235cf4c3b9264f7b80025d1fef11c2f5",
        hockeyapp_appid_ios: "84f425ffa53f405f9ef2877b20a14c11"
    }

    default = this.jcr_uat;
    //default = this.jcr_prd;

    replaceOrder: true;

    version = this.default.version;

};


/*
PRD production server

English: senryo.global

Chinese: senryo.global-zh



UAT test server

senryo.global.test

senryo.global-zh.test
*/