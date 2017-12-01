import { expect } from 'chai';

import wordpress from '../src/wordpress';

import MongoDB from '../src/dbutil';

import config from 'config';

import WPAPI from 'wpapi';

describe('test wordpress', () => {

    const endpoint = config.get('wp_endpoint');
    const username = config.get('wp_username');
    const password = config.get('wp_password');

    const wp = new WPAPI({
        'endpoint': endpoint,
        'username': username,
        'password': password
    });

    it('send a new category', async (done) => {
        let data = {id:'123456',name:'sendNewCategory'};
        let id = await wordpress.createCategory(data);
        console.log(id);                               
        let category = wp.categories().id(id);
        console.log(category.name);
        expect(category.name).to.equal('sendNewCategory');                                        
        done();
    });

    it('remove the specified category', (done) => {
        let data = {id:'123456',name:'sendNewCategory'};
        wordpress.deleteCategory(data);
        MongoDB.queryDB(data,function(result){                 
            if(result){                 
                let category = wp.categories().id(result.wpListId);
                console.log(category);
                expect(category).to.not.be.ok;
            }                              
        });
        done();
    });
});