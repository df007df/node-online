var USER = [],
    memcached = require('./cache'),
    phpunserialize = require('php-unserialize'),
    socketList = {};






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

    var fn = function(result) {
        var info = {userId: userId, data: null};
        if (result && result[userId]) {
            info.data = result[userId];
            socket.broadcast.emit('online',  info);

            addSocketList(socket.id, info);
        }
    }

    info = searchSocketList(userId);
    if (info) {
        //socket.broadcast.emit('online',  info);
    } else {
        getOnlineUser(fn);
    }
}


function offlineUser(socketId) {
    //删除用户的所有保存的链接socket
    var info = delSocketList(socketId);

    console.log('info', info);

    if (info) {
        delSocketListByUser(info.userId);
    }

    //清除缓存吧
    return info;
}


function searchSocketList(userId) {

    for (var sock in socketList) {
        if (socketList.hasOwnProperty(sock)) {
            if (socketList[sock].userId === userId) {
                return socketList[sock];
            }
        }
    }
    return null;
}

function addSocketList(id, info) {
    socketList[id] = info;
}

function delSocketList(id) {
    var info = null;
    if (socketList[id]) {
        info = socketList[id];
        delete socketList[id];
    }

    return info;
}

function delSocketListByUser(userId) {
    var info = null;
    for (var sock in socketList) {
        if (socketList.hasOwnProperty(sock)) {
            if (socketList[sock].userId === userId) {
                info = delSocketList(sock);
            }
        }
    }
    return info;
}



exports.getOnlineUser = getOnlineUser;
exports.sendNewUser = sendNewUser;
exports.offlineUser = offlineUser;