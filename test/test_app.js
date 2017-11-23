import Koa from 'koa';
import body from 'koa-better-body';

import router from '../src/routes';

const app = new Koa();

// Ref https://github.com/tunnckoCore/koa-better-body
app.use(body());
// Ref https://github.com/alexmingoia/koa-router
app.use(router.routes());
app.use(router.allowedMethods());

export default app;