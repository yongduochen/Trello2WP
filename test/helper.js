// Nock Back https://github.com/node-nock/nock#nock-back
import { back as nockBack } from 'nock';
nockBack.fixtures = __dirname + '/fixtures/';

if(process.env.NODE_ENV !== 'test'){
    nockBack.setMode('record');
}

