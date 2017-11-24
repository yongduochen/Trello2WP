import mongoose from 'mongoose';

const db = mongoose.createConnection('mongodb://127.0.0.1:27017/list');
const monSchema = mongoose.Schema({
    tloListId:{type:String},
    wpListId:{type:String}
});
const monModel = db.model('user',monSchema); // 选择集合

export default class MongoDB{

    // 插入数据
    static async insertDB(response,data){
        // 数据集
        let content = {
            tloListId:data.id,
            wpListId:response.id
        };
        // 实例化对象并插入数据
        let monInsert = new monModel(content);
        monInsert.save(function(err){
            if(err){
                console.log(err);
            }else{
                console.log('DB-成功插入数据——>Name：'+data.name+'， wpListId：'+ content.wpListId);
            }
            // db.close();
        });
    }

    // 删除数据
    static async deleteDB(data){
        let del  = {tloListId:data.id};
        
        monModel.remove(del,function(err,result){
            if(err){
                console.log(err);
            }else{
                if(result){
                    console.log("DB-成功删除数据result："+result);  
                } else {
                    console.log("DB-数据库中没有记录"+data.name); 
                }
            }
            // db.close();
        });
    }

    // 查询数据
    static queryDB(data,callback){
        let content = {tloListId:data.id};
        monModel.findOne(content,function(err,result){
            if(err){
                console.log(err);
            }else{
                if(result){
                    console.log("DB-成功查询数据wpId："+result.wpListId); 
                    callback(result);  
                } else {
                    console.log("DB-数据库中没有记录："+data.name); 
                    callback(result); 
                }
                                       
            }
            // db.close();
        });
    }  

}