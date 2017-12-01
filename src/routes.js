import _ from 'lodash';
import ipaddr from 'ipaddr.js';
import Router from 'koa-router';

const router = new Router();

import trello from './trello';
import wordpress from './wordpress';
// import { listenerCount } from 'cluster';

// Ref https://developers.trello.com/v1.0/page/webhooks#section-webhook-source
const ipaddrs = _.map([
    '::1', // DEBUG for ngrok
    '::ffff:127.0.0.1',
    '127.0.0.1',
    '107.23.104.115', 
    '107.23.149.70', 
    '54.152.166.250', 
    '54.164.77.56'], ip => {
    return ipaddr.process(ip);
});

// Webhook callback
router.head('/trellocallback', async ctx => {
    ctx.status = 200;
});

router.post('/trellocallback', async ctx => {
    // Check source IP Ref https://stackoverflow.com/a/30904383
    // https://github.com/whitequark/ipaddr.js
    if(_.find(ipaddrs, _.partial(_.isEqual, ipaddr.process(ctx.ip))) == undefined){
        ctx.status = 404;
        return;
    }   

    let action = await trello.parseHookEvent(ctx.request.fields);
    if(action != null){
        if(action.type == 'createCard'){
            await wordpress.createPost(action.data);
        } else if(action.type == 'createList'){
            await wordpress.createCategory(action.data);
        } else if(action.type == 'updateList'){
            if(action.display.translationKey == 'action_renamed_list'){
                await wordpress.updateCategory(action.data);
            } else if(action.display.translationKey == 'action_archived_list'){                
                await wordpress.deleteCategory(action.data);
            }          
        }
        ctx.status = 200;
    }   
      
});

export default router;