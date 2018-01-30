import { IonicModule } from 'ionic-angular';
import { Data } from './../framework/data/data';

export class Notice extends Data {
    images;
    subtitle;
    update;
    start;
    create;
    links;
    id;
    published;
    title;
    type;
    isRead: boolean = true;
    date;
    getDefaultImage(): string {
        let urlString = super.getImage('default', 750, false);
        if (urlString) {
            let subString = urlString.substring(urlString.lastIndexOf('/') + 1);
            urlString.replace(subString, encodeURIComponent(subString));
        }
        return urlString;
    }
}