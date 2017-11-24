import _ from 'lodash';
import ipaddr from 'ipaddr.js';
import Router from 'koa-router';
const router = new Router();

import trello from './trello';
import wordpress from './wordpress';
import { listenerCount } from 'cluster';

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
        } 
        // 将List的创建事件结果传递到WP
        else if(action.type == 'createList'){
            // console.log('Routes-新建的List是否存在：');
            await wordpress.createCategory(action.data);
        }
        // 将List的更新事件结果传递到WP
        else if(action.type == 'updateList'){
            if(action.display.translationKey == 'action_renamed_list'){
                console.log("Routes-触发重命名List事件："+'action_renamed_list');
                await wordpress.updateCategory(action.data);

            } else if(action.display.translationKey == 'action_archived_list'){                
                console.log("Routes-触发归档List事件："+'action_archived_list');
                await wordpress.deleteCategory(action.data);
            }          
        }
        ctx.status = 200;
    }
    
    // 在每次发送Post时，将Trello中List映射到数据库和WP中，进行初始化
    // let lists = await trello.fetchListsInBoard();
    // var n = 0;
    // for(let i = 0; i < lists.length; i++){        
    //     // console.log('List'+(i+1)+'：'+lists[i].name);
    //     await wordpress.initCategories({
    //         'id':lists[i].id,
    //         'name':lists[i].name
    //     });
    // }
      
});

export default router;