var nMemcached = require( 'memcached' ),
	memcached = null,
	crypto = require('crypto'),
	md5 = null;

memcached = new nMemcached("127.0.0.1:11211" );


function getQueKey(key) {
	var hash = crypto.createHash('md5');
	return hash.update(key).digest();
}

function set(key, value, fn) {

	//key = getQueKey(key);
	memcached.set(key, value, 0, function(err, result) {
		if(err) {
			console.error( err );
		} else {
			fn(result);
		}
		//memcached.end();
	});

}


function get(key, fn) {

	memcached.get(key, function(err, result) {
		if(err) {
			console.error( err );
		} else {
			if (result !== false) {
				fn(result.toString());
			} else {
				fn(false);
			}

		}
		//memcached.end();

	});

}

exports.set = set;
exports.get = get;
exports.getQueKey = getQueKey;