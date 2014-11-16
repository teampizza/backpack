var restify = require('restify');
var mongojs = require('mongojs');

var db = mongojs('localhost:27017', ['netdata']);

var server = restify.createServer({
		name: 'backpacklistener',
});

server.listen(3001);

server.post('/netdata', function create(req, res, next) {

		var body = '';
    req.on('data', function (data) {
        body += data;
				// console.log(body.toString());
    });
    req.on('end', function () {
				// simple search for bad domain connect.facebook.net
				// nslookup: 23.73.127.228
				var stringbody = body.toString();
				var facedetect = stringbody.indexOf("facebook")
				if (facedetect != -1) { // we found facebook
						
				}
				
				// TODO DB storage and non-crazy searching
				// db.netdata.save(product,
  			// 								function (err, data) {
  			// 										res.writeHead(200, {
  			// 												'Content-Type': 'application/json; charset=utf-8'
  			// 										});
  			// 										res.end(JSON.stringify(data));
  			// 								});
    });
		res.end('AAAAAAAAAAAAA');
});
