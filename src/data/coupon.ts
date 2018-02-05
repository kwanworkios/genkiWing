import { Data } from './../framework/data/data';
import { Reward } from './reward';
import { Extra } from './extra';
export class Coupon extends Data {
    id;
    update: number;
    start: number;
    expire: number;
    //brand:any;
    code;
    used: boolean;
    type: string;
    //create;
    rewardId: number;
    couponState: string;


    /// add 6.20.
    ExpiryDate;
    RewardCodeType;
    CouponStatus;
    CouponID;
    PromotionCode;
    POSPLUID;
    RedemptionDate;
    EffectiveDate;

    CpmtrImage;
    CpmtrTitleEN;
    CpmtrTitleTC;
    CpmtrTncEN;
    CpmtrTncTC;


    qrcode;


    // my
    date;
    currentTitle;
    currentTnc;
    reward: Reward;
    extra: Extra;
}