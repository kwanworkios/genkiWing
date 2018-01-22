export class Message {
    channel: string;
    event: string;
    callback: any;

    constructor(channel: string, event: string, callback) {
        this.channel = channel;
        this.event = event;
        this.callback = callback;
    }

}