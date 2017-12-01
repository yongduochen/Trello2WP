import config from 'config';
import rp from 'request-promise';

// Read Configuration
const api_key = config.get('trello_api_key');
const api_token = config.get('trello_api_token');

export default class Trello{
    
    static async fetchCard(id){
        let options = {
            method: 'GET',
            uri: `https://api.trello.com/1/cards/${id}?key=${api_key}&token=${api_token}`,
            json: true
        };
        try {
            let body = await rp(options);
            return await body;
        } catch (error) {
            console.log(error);
            throw error;
        } 
    }

    /**
     * Function name: 
     * Functional description: 
     * @param {*} id 
     */
    static async fetchList(id){
        let options = {
            method: 'GET',
            uri: `https://api.trello.com/1/lists/${id}?key=${api_key}&token=${api_token}`,
            json: true
        };
        try {
            let body = await rp(options);
            return await body;
        } catch (error) {
            console.log(error);
            throw error;
        } 
    }

    /**
     * Function name: 
     * Functional description: 
     * @param {*} fields 
     */
    static async parseHookEvent(fields){
        if(fields.action.type == 'createCard'){
            let cardId = fields.action.data.card.id;
            let card = await this.fetchCard(cardId);
            return await {
                'type': fields.action.type,
                'data': card
            };
        } else if(fields.action.type == 'createList'){ 
            let listId = fields.action.data.list.id;
            let list = await this.fetchList(listId);
            return await {
                'type': fields.action.type,
                'data': list
            };
        } else if(fields.action.type == 'updateList'){ 
            let listId = fields.action.data.list.id;
            let list = await this.fetchList(listId);
            return await {
                'type': fields.action.type,
                'data': list,
                'display': fields.action.display
            };
        } else {
            return await null;
        }
    }

}