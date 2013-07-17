var nMemcached = require( 'memcached' ),
	memcached = null,
	crypto = require('crypto'),
	md5 = null;

memcached = new nMemcached("192.168.0.33:11211" );	
md5 = crypto.createHash('md5');


function getQueKey(key) {
	var key = md5.update(key);
	return md5.digest('hex');
}

function set(key, value, fn) {


	memcached.set(getQueKey(key), value, 0, function(err, result) {
		if(err) {
			console.error( err );
		} else {
			fn(result);
		}
		memcached.end();
	});

}


function get(key, fn) {

	memcached.get(getQueKey(key), function(err, result) {
		if(err) {
			console.error( err );
		} else {
			fn(result);
		}
		memcached.end();

	});

}

exports.set = set;
exports.get = get;