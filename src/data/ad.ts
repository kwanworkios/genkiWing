import { Data } from './../framework/data/data';

export class Ad extends Data {
    id: number;
    update: string;
    desc: string;
    restriction: string;
    name: string;

    links: any;
    published: boolean;
    type: string;

    featured: boolean;

    start: number;
    handle: string;
    share: any;

    handleDate: any;

    isRead: boolean = true;
    isPersonalMsgRead: boolean = true;

    getDefaultImage(): string {
        let urlString = super.getImage('default', 750, false);
        if(urlString) {
            let subString = urlString.substring(urlString.lastIndexOf('/') + 1);
            urlString.replace(subString, encodeURIComponent(subString));
        }
        return urlString;
    }

    getThumbnailImage(): string {
        let urlString = super.getImage('thumbnail', 750, false);
        if(urlString) {
            let subString = urlString.substring(urlString.lastIndexOf('/') + 1);
            urlString.replace(subString, encodeURIComponent(subString));
        }
        return urlString;
    }
}