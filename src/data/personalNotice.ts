import { Data } from './../framework/data/data';

export class PersonalNotice extends Data {
    ReadStatus;
    ContentTC;
    GUID;
    SubtitleTC;
    EffectiveFrom: string;
    TitleTC;
    ContentEN;
    Image;
    TitleEN;
    EffectiveTo;
    SubtitleEN;


    // 加的处理日期
    date;

    isPersonalMsgRead: boolean = true;


    // 對中英的處理
    currentTitle;
    currentSubtitle;
    currentContent;
}