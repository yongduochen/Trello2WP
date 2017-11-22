import _ from 'lodash';
import config from 'config';
import rp from 'request-promise';


// Ref https://developers.trello.com/v1.0/page/webhooks
export default class WebHooks{
    constructor(){
        // Read Configuration
        this.api_key = config.get('trello_api_key');
        this.api_token = config.get('trello_api_token');
        this.callback_url = config.get('trello_webhook_callback');
        this.wiki_board_short_id = config.get('wiki_board_short_id');
    }

    async fetchBoardId(short_id){
        let options = {
            method: 'GET',
            uri: `https://api.trello.com/1/boards/${short_id}` + 
            `?fields=id&key=${this.api_key}&token=${this.api_token}`,
            json: true
        };
        try {
            let body = await rp(options);
            return await body.id;
        } catch (error) {
            console.log(error);
            throw error;
        } 
    }

    async fetchAllHooks(){
        let options = {
            method: 'GET',
            uri: `https://api.trello.com/1/tokens/${this.api_token}/webhooks/?key=${this.api_key}`,
            json: true
        };
        try {
            let body = await rp(options);
            console.log(body);
            return await body;
        } catch (error) {
            console.log(error);
            throw error;
        } 
    }

    async removeHook(id){
        let options = {
            method: 'DELETE',
            uri: `https://api.trello.com/1/tokens/${this.api_token}/webhooks/${id}?key=${this.api_key}`,
            json: true
        };
        try {
            let body = await rp(options);
            console.log(body);
            return await body;
        } catch (error) {
            console.log(error);
            throw error;
        } 
    }

    async checkAvailableHooks(){
        let hooks = await this.fetchAllHooks();
        let available = await _.chain(hooks).map(function(hook){
            if(hook.callbackURL == this.callback_url){
                return true;
            } else {
                // Using Promise https://hackernoon.com/how-to-use-lo-dash-functions-with-async-await-b0be7709534c
                return this.removeHook(hook.id).then(function(){
                    return false;
                });
            }
        }.bind(this)).indexOf(true).value();
        return await available != -1;
    }

    async register(){
        let available = await this.checkAvailableHooks();
        if(available){
            return await null;
        }

        let model_id = await this.fetchBoardId(this.wiki_board_short_id);

        let options = {
            method: 'POST',
            uri: `https://api.trello.com/1/tokens/${this.api_token}/webhooks/?key=${this.api_key}`,
            body: {
                description: 'Trello2WP',
                callbackURL: this.callback_url,
                idModel: model_id
            },
            json: true
        };
        try {
            let body = await rp(options);
            console.log(body);
            return await body;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}