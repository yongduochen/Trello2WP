import config from 'config';
import WPAPI from 'wpapi';
import MongoDB from './dbutil';

// Read Configuration
const endpoint = config.get('wp_endpoint');
const username = config.get('wp_username');
const password = config.get('wp_password');

const wp = new WPAPI({
    'endpoint': endpoint,
    'username': username,
    'password': password
});

// Authentication http://wp-api.org/node-wpapi/authentication/
// Download and install the WordPress plugin https://github.com/WP-API/Basic-Auth

export default class WordPress{


    static async createPost(data){
        try {
            let response = await wp.posts().create({               
                title: data.name,
                content: data.desc,
                status: 'publish'
            });
            console.log(response);
            return await response.id;
                       
        } catch (error) {
            // 404 Not Found Ref https://stackoverflow.com/questions/34670533/wordpress-rest-api-wp-api-404-error
            console.log(error);
            throw error;
        } 
    }

    // 创建一个类：createCategory
    static async createCategory(data){
        try {
            let response = await wp.categories().create({              
                name: data.name
            });
            
            MongoDB.insertDB(response,data);
            console.log("WP中wpListId为："+response.id+"，已经新建...");

            return await response.id;                    
        } catch (error) {
            // 404 Not Found Ref https://stackoverflow.com/questions/34670533/wordpress-rest-api-wp-api-404-error
            console.log(error);
            throw error;
        } 
    }

    // 更新某个分类：updateCategory
    static async updateCategory(data){
        try {
            MongoDB.queryDB(data,function(result){                 
                if(result){  
                    console.log(wp.categories().id(result.wpListId));                  
                    let response = wp.categories().id(result.wpListId).update({
                        name:data.name
                    });
                    console.log("WP中name为："+data.name+"，已经更新...");
                    // console.log(response);
                } else {                   
                    
                }                               
            }); 

        } catch (error) {
            // 404 Not Found Ref https://stackoverflow.com/questions/34670533/wordpress-rest-api-wp-api-404-error
            console.log(error);
            throw error;
        } 
    }

    // 删除某个分类：deleteCategory
    static async deleteCategory(data){
        try {   
            MongoDB.queryDB(data,function(result){
                if(result){
                    let response = wp.categories().id(result.wpListId).delete({
                        force:true
                    });
                    MongoDB.deleteDB(data);
                    console.log("WP中wpListId为："+result.wpListId+"，已经删除...");
                } 
            });    
        } catch (error) {
            // 404 Not Found Ref https://stackoverflow.com/questions/34670533/wordpress-rest-api-wp-api-404-error
            console.log(error);
            throw error;
        } 
    }

    // 在发送post时初始化分类列表
    static async initCategories(data){
        try {                 
            MongoDB.queryDB(data,function(result){
                if(result){
                    console.log("WP中wpListId为："+result.wpListId+"，已经存在...");                        
                } else {
                    console.log("Trello中Name为："+data.name+"，需新建...");
                    let response = wp.categories().create({               
                        name: data.name
                    });
                    MongoDB.insertDB(response,data);
                    console.log("WP中wpListId为："+response.id+"，已经新建...");

                }
            });
                
        } catch (error) {
            // 404 Not Found Ref https://stackoverflow.com/questions/34670533/wordpress-rest-api-wp-api-404-error
            console.log(error);
            throw error;
        }
    }

}