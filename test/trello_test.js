import { expect } from 'Chai';

import trello from '../src/trello';

import { back as nockBack } from 'nock';

describe('test routes', () => {

    // https://trello.com/c/JRar9IOg/reports.json
    it('fetch a exists card', (done) => {
        nockBack('fetch_a_exists_card.json', async (nockDone) => {
            let card = await trello.fetchCard('5a0d4cfbcadcbb84f1829be5');
            expect(card).to.have.property('id');
            nockDone();
            done();
        });
    });

});