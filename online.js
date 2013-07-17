var USER = [],
	memcached = require('./cache'),
	phpunserialize = require('php-unserialize');



function addUser(userId) 
{

	USER[userId] = userId;
	
	console.log('Server has started!');
}


function delUser() {


}

//get user of online
function getOnlineUser(fn) 
{
	var key = '38de037b69465ea73258ea9fa2a30c75'

	var fnn = function(result) {

		if (result !== false) {
			fn(phpunserialize.unserialize(result));	
		} else {
			fn(null);

		}
		
	}

	memcached.get(key, fnn);

}


//send new user of online
function sendNewUser(userId, socket) {
	 var info = {userId: userId, data: null};
	 //get userinfo form memcached
		
     var fn = function(result) {

        
        if (result && result[userId]) {
            info.data = result[userId];
        	socket.broadcast.emit('online',  info);
        }
     	

     	//get user info form memcached


     }	

	 getOnlineUser(fn);
	

	 

	 
}



exports.addUser = addUser;
exports.delUser = delUser;
exports.getOnlineUser = getOnlineUser;
exports.sendNewUser = sendNewUser;