import config from 'config';
import rp from 'request-promise';

// Read Configuration
const api_key = config.get('trello_api_key');
const api_token = config.get('trello_api_token');
const board_id = config.get('wiki_board_short_id');

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

    static async fetchList(id){
        let options = {
            method: 'GET',
            uri: `https://api.trello.com/1/lists/${id}?key=${api_key}&token=${api_token}`,
            json: true
        }
        try {
            let body = await rp(options);
            return await body;
        } catch (error) {
            console.log(error);
            throw error;
        } 
    }

    static async fetchListsInBoard(){
        let options = {
            method: 'GET',
            uri: `https://api.trello.com/1/boards/${board_id}/lists?key=${api_key}&token=${api_token}`,
            json: true
        }
        try {
            let body = await rp(options);
            console.log("Trello-获取Board上所有的List");
            return await body;
        } catch (error) {
            console.log(error);
            throw error;
        } 
    }

    static async parseHookEvent(fields){
        if(fields.action.type == 'createCard'){
            let cardId = fields.action.data.card.id;
            let card = await this.fetchCard(cardId);
            return await {
                'type': fields.action.type,
                'data': card
            }
        } else if(fields.action.type == 'createList'){ // 创建 List
            console.log('Trello-触发新建List事件：'+fields.action.type);

            let listId = fields.action.data.list.id;
            let list = await this.fetchList(listId);
            return await {
                'type': fields.action.type,
                'data': list
            }
        } else if(fields.action.type == 'updateList'){ // 更新 List
            console.log('Trello-触发更新List事件：'+fields.action.type);

            let listId = fields.action.data.list.id;
            let list = await this.fetchList(listId);
            return await {
                'type': fields.action.type,
                'data': list,
                'display': fields.action.display
            }
        } else {
            return await null;
        }
    }

}