import config from 'config';
import mongoose from 'mongoose';

const dbpath = config.get('DB_list');
// const db = mongoose.createConnection('mongodb://127.0.0.1:27017/trello2wp');
const db = mongoose.createConnection(dbpath);
const monSchema = mongoose.Schema({
    tloListId:{type:String},
    wpListId:{type:String}
});
const monModel = db.model('list',monSchema); 

export default class MongoDB{

    /**
     * Function name: insertDB
     * Functional description:According to the specified data insert database records.
     * @param {*} response 
     * @param {*} data Json object containing list id.
     */
    static async insertDB(response,data){
        let content = {
            tloListId:data.id,
            wpListId:response.id
        };

        await monModel.create(content,function(err,result){
            if(err){
                console.log(err);
            }else{
                console.log('DB successfully insert the record. Name：'+
                    data.name+'， wpListId：'+ result.wpListId);
            }
        });
    }

    /**
     * Function name: deleteDB
     * Functional description: According to the specified id delete database records.
     * @param {*} data Json object containing list id.
     */
    static async deleteDB(data){
        let del  = {tloListId:data.id};
        
        await monModel.remove(del,function(err,result){
            if(err){
                console.log(err);
            }else{
                if(result){
                    console.log('DB successfully delete the record.');  
                } else {
                    console.log('This record does not exist in the database.'); 
                }
            }
        });
    }

    /**
     * Function name: queryDB
     * Functional description: According to the specified id query database records.
     * @param {*} data Json object containing list id.
     * @param {*} callback 
     */
    static async queryDB(data,callback){
        let content = {tloListId:data.id};
        await monModel.findOne(content,function(err,result){
            if(err){
                console.log(err);
            }else{
                if(result){
                    console.log('DB successfully query the record.');  
                } else {
                    console.log('This record does not exist in the database.');   
                } 
                callback(result);                                      
            }
        });
    } 
     
}