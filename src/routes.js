import _ from 'lodash';
import ipaddr from 'ipaddr.js';
import Router from 'koa-router';
const router = new Router();

import trello from './trello';
import wordpress from './wordpress';

const ipaddrs = _.map([
    '::1', // DEBUG for ngrok
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
    // Check source IP
    if(_.find(ipaddrs, _.partial(_.isEqual, ipaddr.process(ctx.ip))) == undefined){
        ctx.status = 404;
        return;
    }

    console.log(ctx.request.fields);
    let action = await trello.parseHookEvent(ctx.request.fields);
    if(action != null){
        if(action.type == 'createCard'){
            await wordpress.createPost(action.data);
        }
    }
});

export default router;