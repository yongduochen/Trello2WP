import { expect } from 'chai';

import trello from '../src/trello';

import { back as nockBack } from 'nock';

// import fx from 'node-fixtures';

describe('test trello', () => {

    // https://trello.com/c/JRar9IOg/reports.json
    it('fetch a exists card', (done) => {
        nockBack('fetch_a_exists_card.json', async (nockDone) => {
            let card = await trello.fetchCard('5a0d4cfbcadcbb84f1829be5');
            expect(card).to.have.property('id');
            nockDone();
            done();
        });
    });

    // https://trello.com/c/JRar9IOg/reports.json   (id 5a1cb46169ea4962adbd7dea)
    it('fetch a exists list', (done) => {
        nockBack('fetch_a_exists_list.json', async (nockDone) => {
            let card = await trello.fetchList('5a1cb46169ea4962adbd7dea'); 
            expect(card).to.have.property('id');
            nockDone();
            done();
        });
    });

});