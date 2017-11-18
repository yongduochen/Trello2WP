import Koa from 'koa';
import body from 'koa-better-body';
import config from 'config';

import router from './routes';
import WebHooks from './webhooks';

const app = new Koa();

// Ref https://github.com/tunnckoCore/koa-better-body
app.use(body());
// Ref https://github.com/alexmingoia/koa-router
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.get('listen_port') || 8001);

// Register webhook

const webhook = new WebHooks();
webhook.register();
