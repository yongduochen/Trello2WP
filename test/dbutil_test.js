import { expect } from 'chai';

import MongoDB from '../src/dbutil';

describe('test dbutil', () => {

    it('insert a exists record', (done) => {
        let response = {id:'00'};
        let data = {id:'5a1cb46169ea4962adbd7dea',name:'insertTest'};
        MongoDB.insertDB(response,data);
        MongoDB.queryDB(data,function(result){
            console.log(result);
            expect(result.wpListId).to.equal('00');           
        }); 
        done();       
    });

    it('query a exists record', (done) => {
        let data = {id:'5a1cb46169ea4962adbd7dea',name:'queryTest'};
        MongoDB.queryDB(data,function(result){
            console.log(result);
            expect(result.wpListId).to.equal('00');                       
        });    
        done();     
    });

    it('delete a exists record', (done) => {
        let data = {id:'5a1cb46169ea4962adbd7dea',name:'deleteTest'};
        MongoDB.deleteDB(data);
        MongoDB.queryDB(data,function(result){
            console.log(result);
            expect(result).to.equal(null);         
        });      
        done();   
    });
});