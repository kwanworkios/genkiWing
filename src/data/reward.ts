import { Data } from './../framework/data/data';
export class Reward extends Data {
    redemption: string;
    desc: string;
    restriction: string;
    id: string;
    type: string;
    name: string;
    quota: number;
    backendId: string;

    chance;
    cost;
    create;
    end;
    hint;
    images;
    instruction;
    inventory;
    published;
    redemptions;
    spending;
    start;
    storeIds;
    tier;
    update;

    getDefaultImage(): string {
        let urlString = super.getImage('default', 750, false);
        if (urlString) {
            let subString = urlString.substring(urlString.lastIndexOf("/") + 1);
            urlString.replace(subString, encodeURIComponent(subString));
        }

        return urlString;
    }
}