import { Message } from './../ably/message';
import { ConfigService } from './config.service';
import { BaseService } from '../base/base-service';
import { Injectable } from '@angular/core';

declare var Ably: any;

@Injectable()
export class PubsubService extends BaseService {

    ably: any;

    constructor(public configService: ConfigService) {

        super();

    }

    private connect(callback) {

        console.log("connect")

        var apiKey = this.configService.get("ably");

        if(!apiKey){
            console.log("Ably not configured!! Add key to your config profile.");
            return;
        }

        var ably = new Ably.Realtime(apiKey);
        ably.connection.on('connected', ()=> {
            console.log("You're now connected to Ably in realtime");
            this.ably = ably;

            callback();

        });



    }

    subscribe(channel: string, event: string, callback) {

        // if(!this.ably){
            
        //     this.connect( ()=>{

        //         this.subscribe2(channel, event, callback);

        //     });

        //     return;
        // }

        // this.subscribe2(channel, event, callback);

        let message: Message = new Message(channel, event, callback);
        let messages: Array<Message> = new Array<Message>();
        this.subscribeList(messages);

    }

    subscribeList(messages: Array<Message>) {
        
        if(!this.ably){
            
            this.connect( ()=>{

                messages.forEach(message => {
                    this.subscribe2(message.channel, message.event, message.callback);
                });

            });

            return;
        }

        messages.forEach(message => {
            this.subscribe2(message.channel, message.event, message.callback);
        });
    }

    private subscribe2(channel: string, event: string, callback) {

        

        var c = this.ably.channels.get(channel);

        console.log("subscribed", channel, event);

        c.subscribe(event, function (message) {
            console.log("Received message", message.data);
            callback(message);

        });

    }

    unsubscribe(channels: Array<string>) {
        console.log('unsubscrible');
        if (this.ably) {
            console.log('pubsub unsubscribe');
            channels.forEach(channel => {
                let c = this.ably.channels.get(channel);
                c.unsubscribe();
            });
            //this.ably.connection.off();
        }
    }

}