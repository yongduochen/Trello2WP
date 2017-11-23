import { expect } from 'chai';
import rp from 'request-promise';
import fx from 'node-fixtures';

import { default as nock, back as nockBack } from 'nock';

import app from './test_app';
import ip_spoofing_app from './test_ip_spoofing_app';

describe('test routes', () => {
    var server;
    var ip_spoofing_server;

    before(() => {
        server = app.listen(8001);
        ip_spoofing_server = ip_spoofing_app.listen(8002);
    });

    it('should return status code 200 when using HEAD method to request /trellocallback', async () => {
        nock.enableNetConnect('127.0.0.1');

        let options = {
            method: 'HEAD',
            uri: 'http://127.0.0.1:8001/trellocallback',
            // https://github.com/request/request-promise#get-the-full-response-instead-of-just-the-body
            resolveWithFullResponse: true,
            simple: false
        };
        let response = await rp(options);
        expect(response.statusCode).to.equal(200);
    });

    it('should return status code 200 when the createCard callback is triggered.', (done) => {
        nockBack('create_card_webhook_callback.json', async (nockDone) => {
            nock.enableNetConnect('127.0.0.1');

            let options = {
                method: 'POST',
                uri: 'http://127.0.0.1:8001/trellocallback',
                body: JSON.stringify(fx.create_card),
                headers: {
                    'content-type': 'application/json'
                },
                resolveWithFullResponse: true,
                simple: false
            };
            let response = await rp(options);
            expect(response.statusCode).to.equal(200);
            nockDone();
            done();
        });
    });

    it('should return status code 404 when a request for an unknown IP source is received', async () => {
        nock.enableNetConnect('127.0.0.1');

        let options = {
            method: 'POST',
            uri: 'http://127.0.0.1:8002/trellocallback',
            resolveWithFullResponse: true,
            simple: false
        };
        let response = await rp(options);
        expect(response.statusCode).to.equal(404);
    });

    after(() => {
        server.close();
        ip_spoofing_server.close();
    });

});
