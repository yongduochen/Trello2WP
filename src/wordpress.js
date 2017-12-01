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

    /**
     * Function name: createCategory
     * Functional description: 
     * @param {*} data 
     */
    static async createCategory(data){
        try {
            let response = await wp.categories().create({              
                name: data.name
            });           
            MongoDB.insertDB(response,data);
            return await response.id;                    
        } catch (error) {
            // 404 Not Found Ref https://stackoverflow.com/questions/34670533/wordpress-rest-api-wp-api-404-error
            console.log(error);
            throw error;
        } 
    }

    /**
     * Function name: updateCategory
     * Functional description: 
     * @param {*} data 
     */
    static async updateCategory(data){
        try {
            MongoDB.queryDB(data,function(result){                 
                if(result){  
                    console.log(wp.categories().id(result.wpListId));                  
                    wp.categories().id(result.wpListId).update({
                        name:data.name
                    });
                }                              
            }); 
        } catch (error) {
            // 404 Not Found Ref https://stackoverflow.com/questions/34670533/wordpress-rest-api-wp-api-404-error
            console.log(error);
            throw error;
        } 
    }

    /**
     * Function name: deleteCategory
     * Functional description: 
     * @param {*} data 
     */
    static async deleteCategory(data){
        try {   
            MongoDB.queryDB(data,function(result){
                if(result){
                    wp.categories().id(result.wpListId).delete({
                        force:true
                    });
                    MongoDB.deleteDB(data);
                } 
            }); 
              
        } catch (error) {
            // 404 Not Found Ref https://stackoverflow.com/questions/34670533/wordpress-rest-api-wp-api-404-error
            console.log(error);
            throw error;
        } 
    }
}