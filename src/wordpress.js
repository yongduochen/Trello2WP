import config from 'config';
import WPAPI from 'wpapi';

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

}